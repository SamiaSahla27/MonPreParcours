import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { JeuService } from './jeu.service';
import type {
  AfficherReponsePayload,
  CreerSessionPayload,
  QuestionSuivantePayload,
  RejoindrePayload,
  RepondrePayload,
  ReprendreSessionPayload,
  TerminerJeuPayload,
} from './jeu.types';

const ACCESS_CODE = 'ellesbougent2024';
const roomName = (pin: string) => `jeu:${pin}`;

@WebSocketGateway({
  namespace: '/jeu',
  cors: { origin: true, credentials: true },
})
export class JeuGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly jeu: JeuService) {}

  handleConnection(socket: Socket) {
    const pin = String(socket.handshake.auth?.pin ?? '');
    const participantId = String(socket.handshake.auth?.participantId ?? '');
    if (!pin || !participantId) return;
    this.rejoindre(socket, { pin, participantId });
  }

  handleDisconnect(socket: Socket) {
    const disconnected = this.jeu.deconnecter(socket.id);
    if (!disconnected) return;
    const { session, role } = disconnected;
    if (role === 'animatrice') {
      this.server.to(roomName(session.pin)).emit('session-pause', {
        message: "L'animatrice est déconnectée. La session reprendra bientôt.",
      });
      return;
    }
    this.emettreCompteur(session.pin);
  }

  @SubscribeMessage('creer-session')
  creerSession(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: CreerSessionPayload,
  ) {
    if (payload.accessCode !== ACCESS_CODE)
      return { ok: false, error: 'CODE_INCORRECT' };
    const session = this.jeu.creerSession(socket.id);
    void socket.join(roomName(session.pin));
    socket.emit('session-creee', {
      pin: session.pin,
      recoveryKey: session.recoveryKey,
    });
    return {
      ok: true,
      pin: session.pin,
      recoveryKey: session.recoveryKey,
    };
  }

  @SubscribeMessage('reprendre-session')
  reprendreSession(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: ReprendreSessionPayload,
  ) {
    const session = this.jeu.reprendreSession(
      payload.pin,
      payload.recoveryKey,
      socket.id,
    );
    if (!session) return { ok: false, error: 'REPRISE_REFUSEE' };
    void socket.join(roomName(session.pin));
    const resumed = {
      pin: session.pin,
      currentQuestion: session.currentQuestion,
      phase: session.phase,
    };
    this.server.to(roomName(session.pin)).emit('session-reprise', resumed);
    this.emettreCompteur(session.pin);
    return { ok: true, ...resumed };
  }

  @SubscribeMessage('rejoindre')
  rejoindre(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: RejoindrePayload,
  ) {
    const joined = this.jeu.rejoindre(payload, socket.id);
    if (!joined) return { ok: false, error: 'SESSION_INTROUVABLE' };

    void socket.join(roomName(joined.session.pin));
    socket.data.jeu = {
      pin: joined.session.pin,
      participantId: payload.participantId,
    };
    socket.emit('session-rejointe', {
      pin: joined.session.pin,
      phase: joined.session.phase,
      currentQuestion: joined.session.currentQuestion,
      score: joined.participant.score,
    });
    this.emettreCompteur(joined.session.pin);

    if (joined.session.currentQuestion >= 0) {
      socket.emit('nouvelle-question', {
        questionIndex: joined.session.currentQuestion,
        phase: joined.session.phase,
      });
      socket.emit('resultats-live', this.jeu.resultatsLive(joined.session));
    }
    return { ok: true, pin: joined.session.pin };
  }

  @SubscribeMessage('repondre')
  repondre(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: RepondrePayload,
  ) {
    const response = this.jeu.repondre(payload);
    if (!response) return { ok: false, error: 'REPONSE_REFUSEE' };
    const live = this.jeu.resultatsLive(response.session);
    this.server.to(roomName(response.session.pin)).emit('resultats-live', live);
    socket.emit('reponse-enregistree', {
      score: response.participant.score,
      dejaRepondu: response.dejaRepondu,
    });
    return { ok: true, score: response.participant.score };
  }

  @SubscribeMessage('question-suivante')
  questionSuivante(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: QuestionSuivantePayload,
  ) {
    const session = this.jeu.trouverSession(payload.pin);
    if (!session || session.animatriceId !== socket.id) {
      return { ok: false, error: 'NON_AUTORISE' };
    }
    session.currentQuestion = payload.questionIndex;
    session.phase = payload.phase ?? 'quiz';
    this.server.to(roomName(session.pin)).emit('nouvelle-question', {
      questionIndex: session.currentQuestion,
      phase: session.phase,
    });
    this.server
      .to(roomName(session.pin))
      .emit('resultats-live', this.jeu.resultatsLive(session));
    return { ok: true };
  }

  @SubscribeMessage('afficher-reponse')
  afficherReponse(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: AfficherReponsePayload,
  ) {
    const session = this.jeu.trouverSession(payload.pin);
    if (!session || session.animatriceId !== socket.id) {
      return { ok: false, error: 'NON_AUTORISE' };
    }
    this.server.to(roomName(session.pin)).emit('bonne-reponse', {
      questionIndex: payload.questionIndex,
      correctIndex: this.jeu.bonneReponse(payload.questionIndex),
    });
    return { ok: true };
  }

  @SubscribeMessage('terminer-jeu')
  terminerJeu(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: TerminerJeuPayload,
  ) {
    const session = this.jeu.trouverSession(payload.pin);
    if (!session || session.animatriceId !== socket.id) {
      return { ok: false, error: 'NON_AUTORISE' };
    }
    session.phase = 'termine';
    this.server.to(roomName(session.pin)).emit('jeu-termine', {
      classement: this.jeu.classement(session),
    });
    return { ok: true };
  }

  private emettreCompteur(pin: string) {
    const session = this.jeu.trouverSession(pin);
    if (!session) return;
    this.server.to(roomName(pin)).emit('participant-rejoint', {
      count: this.jeu.nombreParticipantsConnectes(session),
    });
  }
}
