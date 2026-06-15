import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

const PARTICIPANT_ID_KEY = "jeu-socket-participant-id";
const SESSION_PIN_KEY = "jeu-socket-pin";
const HOST_SESSION_KEY = "jeu-socket-host-session";

export interface LiveResultats {
  questionIndex: number;
  resultats: { A: number; B: number; C: number; D: number; total: number };
  participantCount: number;
  responsePercentage: number;
}

export interface ClassementEntry {
  rank: number;
  participantId: string;
  score: number;
}

interface NouvelleQuestion {
  questionIndex: number;
  phase: "quiz" | "cercle" | "lobby" | "termine" | "pause";
}

interface Ack {
  ok: boolean;
  error?: string;
  pin?: string;
  score?: number;
  recoveryKey?: string;
}

function socketBaseUrl() {
  const configured = import.meta.env.VITE_SOCKET_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return "http://localhost:3000";
}

function participantId() {
  const existing = window.localStorage.getItem(PARTICIPANT_ID_KEY);
  if (existing) return existing;
  const id = window.crypto.randomUUID();
  window.localStorage.setItem(PARTICIPANT_ID_KEY, id);
  return id;
}

export function useJeuSocket(role: "participant" | "animatrice") {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [pin, setPin] = useState(
    () => role === "participant" ? window.localStorage.getItem(SESSION_PIN_KEY) ?? "" : "",
  );
  const [joined, setJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<NouvelleQuestion | null>(null);
  const [liveResults, setLiveResults] = useState<LiveResultats | null>(null);
  const [answerRecorded, setAnswerRecorded] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState<number | undefined>();
  const [score, setScore] = useState(0);
  const [classement, setClassement] = useState<ClassementEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPin = role === "participant" ? window.localStorage.getItem(SESSION_PIN_KEY) ?? "" : "";
    const socket = io(`${socketBaseUrl()}/jeu`, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 800,
      reconnectionDelayMax: 5000,
      auth: role === "participant" && savedPin
        ? { pin: savedPin, participantId: participantId() }
        : undefined,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setError("");
      if (role === "participant" && savedPin) {
        socket.emit("rejoindre", { pin: savedPin, participantId: participantId() });
      }
      if (role === "animatrice") {
        const storedHost = window.sessionStorage.getItem(HOST_SESSION_KEY);
        if (storedHost) socket.emit("reprendre-session", JSON.parse(storedHost));
      }
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setError("Connexion au serveur de jeu impossible"));
    socket.on("session-creee", ({ pin: createdPin, recoveryKey }: { pin: string; recoveryKey: string }) => {
      setPin(createdPin);
      setJoined(true);
      window.sessionStorage.setItem(
        HOST_SESSION_KEY,
        JSON.stringify({ pin: createdPin, recoveryKey }),
      );
    });
    socket.on("session-reprise", (payload: NouvelleQuestion & { pin: string }) => {
      setPin(payload.pin);
      setJoined(true);
      setPaused(false);
      if (payload.questionIndex >= 0) setCurrentQuestion(payload);
    });
    socket.on("session-rejointe", (payload: { pin: string; score: number }) => {
      setPin(payload.pin);
      setScore(payload.score);
      setJoined(true);
      setPaused(false);
    });
    socket.on("participant-rejoint", ({ count }: { count: number }) => setParticipantCount(count));
    socket.on("nouvelle-question", (payload: NouvelleQuestion) => {
      setCurrentQuestion(payload);
      setAnswerRecorded(false);
      setRevealedAnswer(undefined);
      setLiveResults(null);
      setPaused(false);
    });
    socket.on("resultats-live", (payload: LiveResultats) => setLiveResults(payload));
    socket.on("reponse-enregistree", ({ score: nextScore }: { score: number }) => {
      setScore(nextScore);
      setAnswerRecorded(true);
    });
    socket.on("bonne-reponse", ({ correctIndex }: { correctIndex?: number }) => {
      setRevealedAnswer(correctIndex);
    });
    socket.on("session-pause", () => setPaused(true));
    socket.on("jeu-termine", ({ classement: ranking }: { classement: ClassementEntry[] }) => {
      setClassement(ranking);
      setCurrentQuestion({ questionIndex: 0, phase: "termine" });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [role]);

  const emitAck = useCallback(<T extends Ack>(event: string, payload: unknown) => {
    return new Promise<T>((resolve) => {
      if (!socketRef.current) {
        resolve({ ok: false, error: "SOCKET_INDISPONIBLE" } as T);
        return;
      }
      socketRef.current.timeout(10000).emit(event, payload, (timeoutError: Error | null, result: T) => {
        resolve(timeoutError ? ({ ok: false, error: "TIMEOUT" } as T) : result);
      });
    });
  }, []);

  const createSession = useCallback(async (accessCode: string) => {
    const result = await emitAck<Ack>("creer-session", { accessCode });
    if (!result.ok) setError(result.error === "CODE_INCORRECT" ? "Code incorrect" : "Création impossible");
    return result;
  }, [emitAck]);

  const joinSession = useCallback(async (sessionPin: string) => {
    const normalizedPin = sessionPin.replace(/\D/g, "").slice(0, 6);
    const result = await emitAck<Ack>("rejoindre", {
      pin: normalizedPin,
      participantId: participantId(),
    });
    if (result.ok) {
      window.localStorage.setItem(SESSION_PIN_KEY, normalizedPin);
      setPin(normalizedPin);
      setJoined(true);
      setError("");
    } else {
      setError("Session introuvable. Vérifie le PIN.");
    }
    return result;
  }, [emitAck]);

  const answer = useCallback(async (payload: {
    questionIndex: number;
    optionIndex: number;
    correctIndex?: number;
    isPoll: boolean;
    timeLeft: number;
  }) => {
    const result = await emitAck<Ack>("repondre", {
      ...payload,
      pin,
      participantId: participantId(),
    });
    if (!result.ok) setError("La réponse n'a pas pu être enregistrée");
    return result;
  }, [emitAck, pin]);

  const nextQuestion = useCallback((questionIndex: number, phase: "quiz" | "cercle" = "quiz") => {
    return emitAck<Ack>("question-suivante", { pin, questionIndex, phase });
  }, [emitAck, pin]);

  const revealAnswer = useCallback((questionIndex: number, correctIndex?: number) => {
    return emitAck<Ack>("afficher-reponse", { pin, questionIndex, correctIndex });
  }, [emitAck, pin]);

  const endGame = useCallback(() => emitAck<Ack>("terminer-jeu", { pin }), [emitAck, pin]);

  return {
    connected,
    pin,
    joined,
    participantCount,
    currentQuestion,
    liveResults,
    answerRecorded,
    revealedAnswer,
    score,
    classement,
    paused,
    error,
    createSession,
    joinSession,
    answer,
    nextQuestion,
    revealAnswer,
    endGame,
  };
}
