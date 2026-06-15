import { JeuService } from './jeu.service';

describe(JeuService.name, () => {
  let service: JeuService;

  beforeEach(() => {
    service = new JeuService();
  });

  it('creates a six-digit PIN and reconnects the host', () => {
    const session = service.creerSession('host-1');
    expect(session.pin).toMatch(/^\d{6}$/);

    service.deconnecter('host-1');
    expect(session.phase).toBe('pause');

    const resumed = service.reprendreSession(
      session.pin,
      session.recoveryKey,
      'host-2',
    );
    expect(resumed?.animatriceId).toBe('host-2');
    expect(resumed?.phase).toBe('lobby');
  });

  it('restores a participant and keeps their score', () => {
    const session = service.creerSession('host');
    const joined = service.rejoindre(
      { pin: session.pin, participantId: 'player' },
      'socket-1',
    );
    expect(joined).not.toBeNull();
    session.currentQuestion = 1;
    session.phase = 'quiz';

    const response = service.repondre({
      pin: session.pin,
      participantId: 'player',
      questionIndex: 1,
      optionIndex: 2,
      correctIndex: 0,
      isPoll: true,
      timeLeft: 15,
    });
    expect(response?.participant.score).toBe(100);

    service.deconnecter('socket-1');
    const restored = service.rejoindre(
      { pin: session.pin, participantId: 'player' },
      'socket-2',
    );
    expect(restored?.participant.score).toBe(100);
    expect(restored?.participant.connected).toBe(true);
  });

  it('deduplicates answers for the same question', () => {
    const session = service.creerSession('host');
    service.rejoindre({ pin: session.pin, participantId: 'player' }, 'socket');
    session.currentQuestion = 1;

    const payload = {
      pin: session.pin,
      participantId: 'player',
      questionIndex: 1,
      optionIndex: 2,
      isPoll: false,
      timeLeft: 15,
    };
    service.repondre(payload);
    const duplicate = service.repondre(payload);

    expect(duplicate?.dejaRepondu).toBe(true);
    expect(duplicate?.participant.score).toBe(100);
    expect(session.resultats[1].total).toBe(1);
  });
});
