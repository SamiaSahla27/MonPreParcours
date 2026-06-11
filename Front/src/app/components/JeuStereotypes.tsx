import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Volume2, VolumeX } from "lucide-react";
import { cercleQs, questions } from "./jeu/data";
import { CircleVoice } from "./jeu/CircleVoice";
import { InterludeScreen } from "./jeu/InterludeScreen";
import { IntroScreen } from "./jeu/IntroScreen";
import { ProgressBar } from "./jeu/ProgressBar";
import { QuestionCard } from "./jeu/QuestionCard";
import { ResultsScreen } from "./jeu/ResultsScreen";
import type { GameStage } from "./jeu/types";
import {
  GAME_SYNC_KEY,
  getParticipantId,
  readLiveGameState,
  recordLiveResponse,
  registerParticipant,
  writeLiveGameState,
} from "./jeu/sync";
import { calculateQuestionPoints } from "./jeu/scoring";

const QUESTION_DURATION = 20;

function playTone(enabled: boolean, frequency: number, duration: number) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.08, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
  oscillator.addEventListener("ended", () => void context.close());
}

export default function JeuStereotypes() {
  const [stage, setStage] = useState<GameStage>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [circleIndex, setCircleIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [circleAnswered, setCircleAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<number | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  const participantIdRef = useRef<string | null>(null);

  const currentQuestion = questions[questionIndex];
  const maximumScore = questions.reduce(
    (total, question) => total + (question.isPoll ? 20 : 100),
    0,
  );

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== GAME_SYNC_KEY || stage !== "quiz") return;
      const liveState = readLiveGameState();
      if (liveState.questionIndex === questionIndex) return;
      setQuestionIndex(Math.min(liveState.questionIndex, questions.length - 1));
      setSelectedIndex(null);
      setAnswered(false);
      setTimedOut(false);
      setTimeLeft(QUESTION_DURATION);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [questionIndex, stage]);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (stage !== "quiz" || answered) {
      stopTimer();
      return;
    }

    setTimeLeft(QUESTION_DURATION);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          stopTimer();
          setSelectedIndex(-1);
          setTimedOut(true);
          setAnswered(true);
          if (participantIdRef.current) {
            recordLiveResponse(currentQuestion, -1, participantIdRef.current);
          }
          playTone(soundEnabledRef.current, 180, 0.22);
          return 0;
        }
        if (current === 6) {
          playTone(soundEnabledRef.current, 360, 0.12);
          if ("vibrate" in navigator) navigator.vibrate([45, 35, 45]);
        }
        return current - 1;
      });
    }, 1000);

    return stopTimer;
  }, [answered, currentQuestion, questionIndex, stage, stopTimer]);

  const startGame = useCallback(() => {
    const participantId = getParticipantId();
    participantIdRef.current = participantId;
    registerParticipant(participantId);
    const liveState = readLiveGameState();
    writeLiveGameState({ ...liveState, questionIndex: 0 });
    setStage("quiz");
    setQuestionIndex(0);
    setSelectedIndex(null);
    setAnswered(false);
    setTimedOut(false);
    setScore(0);
    setTimeLeft(QUESTION_DURATION);
    playTone(soundEnabled, 520, 0.12);
  }, [soundEnabled]);

  const handleSelect = useCallback((index: number) => {
    if (answered) return;
    stopTimer();
    setSelectedIndex(index);
    setTimedOut(false);
    setAnswered(true);
    if (participantIdRef.current) {
      recordLiveResponse(currentQuestion, index, participantIdRef.current);
    }

    const isCorrect = !currentQuestion.isPoll && currentQuestion.correct === index;
    const earnedPoints = calculateQuestionPoints(currentQuestion, isCorrect, timeLeft, QUESTION_DURATION);
    setScore((current) => current + earnedPoints);
    if (currentQuestion.isPoll) {
      playTone(soundEnabled, 440, 0.1);
    } else if (isCorrect) {
      playTone(soundEnabled, 720, 0.16);
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.72 },
        colors: ["#1A7A4A", "#A9E5C8", "#FFFFFF"],
      });
    } else {
      playTone(soundEnabled, 175, 0.22);
    }
  }, [answered, currentQuestion, soundEnabled, stopTimer, timeLeft]);

  const nextQuestion = useCallback(() => {
    if (questionIndex >= questions.length - 1) {
      setStage("interlude");
      return;
    }
    setQuestionIndex((current) => current + 1);
    const liveState = readLiveGameState();
    writeLiveGameState({ ...liveState, questionIndex: questionIndex + 1 });
    setSelectedIndex(null);
    setAnswered(false);
    setTimedOut(false);
    setTimeLeft(QUESTION_DURATION);
  }, [questionIndex]);

  const startCircle = useCallback(() => {
    setCircleIndex(0);
    setCircleAnswered(false);
    setStage("circle");
  }, []);

  const handleCircleAnswer = useCallback(() => {
    setCircleAnswered(true);
    playTone(soundEnabled, 470, 0.12);
  }, [soundEnabled]);

  const nextCircleQuestion = useCallback(() => {
    if (circleIndex >= cercleQs.length - 1) {
      setStage("results");
      return;
    }
    setCircleIndex((current) => current + 1);
    setCircleAnswered(false);
  }, [circleIndex]);

  const restart = useCallback(() => {
    stopTimer();
    setStage("intro");
    setQuestionIndex(0);
    setCircleIndex(0);
    setSelectedIndex(null);
    setAnswered(false);
    setTimedOut(false);
    setCircleAnswered(false);
    setScore(0);
    setTimeLeft(QUESTION_DURATION);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stopTimer]);

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#F4F1EC] text-[#1C1C2E]">
      {stage !== "intro" && stage !== "results" ? (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-[#1C1C2E]/95 px-4 backdrop-blur sm:px-6">
          <span className="hidden whitespace-nowrap text-sm font-black text-[#FF7957] sm:block">Et toi ?</span>
          <ProgressBar
            current={stage === "quiz" ? questionIndex + 1 : circleIndex + 1}
            total={stage === "quiz" ? questions.length : cercleQs.length}
            color={stage === "quiz" ? "#E8431A" : "#C47A0A"}
            label={stage === "quiz" ? "Question" : "Cercle"}
          />
        </header>
      ) : null}

      <button
        type="button"
        onClick={() => setSoundEnabled((current) => !current)}
        className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#1C1C2E] text-white shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60"
        aria-label={soundEnabled ? "Désactiver les sons" : "Activer les sons"}
        title={soundEnabled ? "Désactiver les sons" : "Activer les sons"}
      >
        {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
      </button>

      <AnimatePresence mode="wait">
        {stage === "intro" ? <IntroScreen key="intro" onStart={startGame} /> : null}

        {stage === "quiz" ? (
          <QuestionCard
            key={`question-${currentQuestion.id}`}
            question={currentQuestion}
            selectedIndex={selectedIndex}
            answered={answered}
            timedOut={timedOut}
            timeLeft={timeLeft}
            onSelect={handleSelect}
            onContinue={nextQuestion}
            isLast={questionIndex === questions.length - 1}
          />
        ) : null}

        {stage === "interlude" ? (
          <InterludeScreen key="interlude" score={score} maximumScore={maximumScore} onContinue={startCircle} />
        ) : null}

        {stage === "circle" ? (
          <CircleVoice
            key={`circle-${circleIndex}`}
            question={cercleQs[circleIndex]}
            answered={circleAnswered}
            onAnswer={handleCircleAnswer}
            onContinue={nextCircleQuestion}
            isLast={circleIndex === cercleQs.length - 1}
          />
        ) : null}

        {stage === "results" ? (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResultsScreen score={score} maximumScore={maximumScore} onRestart={restart} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
