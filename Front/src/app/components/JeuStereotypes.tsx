import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cercleQs, questions } from "./jeu/data";
import { PinScreen } from "./jeu/PinScreen";
import { WaitingScreen } from "./jeu/WaitingScreen";
import { LiveResults } from "./jeu/LiveResults";
import { ProgressBar } from "./jeu/ProgressBar";
import { QuestionCard } from "./jeu/QuestionCard";
import { useJeuSocket } from "./jeu/useJeuSocket";

const QUESTION_DURATION = 20;

const CircleVoice = lazy(() =>
  import("./jeu/CircleVoice").then((module) => ({ default: module.CircleVoice })),
);
const ResultsScreen = lazy(() =>
  import("./jeu/ResultsScreen").then((module) => ({ default: module.ResultsScreen })),
);

function GameScreenFallback() {
  return (
    <div
      className="flex min-h-[calc(100vh-136px)] items-center justify-center bg-[#1C1C2E] text-sm font-bold text-white/70"
      role="status"
      aria-live="polite"
    >
      Chargement...
    </div>
  );
}

function playTone(enabled: boolean, frequency: number, duration: number) {
  if (!enabled) return;
  const context = new window.AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.06, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
  oscillator.addEventListener("ended", () => void context.close());
}

export default function JeuStereotypes() {
  const socket = useJeuSocket("participant");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [circleAnswered, setCircleAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);
  const [timedOut, setTimedOut] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<number | null>(null);

  const phase = socket.currentQuestion?.phase;
  const questionIndex = Math.min(
    socket.currentQuestion?.questionIndex ?? 0,
    Math.max(questions.length - 1, 0),
  );
  const circleIndex = Math.min(
    Math.max(0, (socket.currentQuestion?.questionIndex ?? questions.length) - questions.length),
    Math.max(cercleQs.length - 1, 0),
  );
  const currentQuestion = questions[questionIndex];
  const answerRevealed = socket.revealedAnswer !== undefined || currentQuestion?.isPoll;
  const maximumScore = questions.reduce(
    (total, question) => total + (question.isPoll ? 20 : 100),
    0,
  );

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase !== "quiz" || socket.answerRecorded) {
      stopTimer();
      return;
    }
    setSelectedIndex(null);
    setTimedOut(false);
    setTimeLeft(QUESTION_DURATION);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          stopTimer();
          setSelectedIndex(-1);
          setTimedOut(true);
          void socket.answer({
            questionIndex,
            optionIndex: -1,
            correctIndex: currentQuestion.correct,
            isPoll: currentQuestion.isPoll,
            timeLeft: 0,
          });
          return 0;
        }
        if (current === 6) {
          playTone(soundEnabled, 360, 0.12);
          navigator.vibrate?.([45, 35, 45]);
        }
        return current - 1;
      });
    }, 1000);
    return stopTimer;
  }, [
    currentQuestion.correct,
    currentQuestion.isPoll,
    phase,
    questionIndex,
    socket.answer,
    socket.answerRecorded,
    soundEnabled,
    stopTimer,
  ]);

  useEffect(() => {
    if (phase === "cercle") setCircleAnswered(false);
  }, [circleIndex, phase]);

  const selectAnswer = useCallback((index: number) => {
    if (socket.answerRecorded) return;
    stopTimer();
    setSelectedIndex(index);
    setTimedOut(false);
    void socket.answer({
      questionIndex,
      optionIndex: index,
      correctIndex: currentQuestion.correct,
      isPoll: currentQuestion.isPoll,
      timeLeft,
    });
  }, [currentQuestion, questionIndex, socket, stopTimer, timeLeft]);

  const answerCircle = useCallback((stoodUp: boolean) => {
    if (circleAnswered) return;
    setCircleAnswered(true);
    void socket.answer({
      questionIndex: questions.length + circleIndex,
      optionIndex: stoodUp ? 0 : 1,
      isPoll: true,
      timeLeft: QUESTION_DURATION,
    });
  }, [circleAnswered, circleIndex, socket]);

  if (!socket.joined) {
    return <PinScreen connected={socket.connected} error={socket.error} onJoin={socket.joinSession} />;
  }

  if (!socket.currentQuestion || phase === "lobby" || socket.paused) {
    return <WaitingScreen pin={socket.pin} paused={socket.paused} />;
  }

  if (phase === "termine") {
    return (
      <Suspense fallback={<GameScreenFallback />}>
        <ResultsScreen
          score={socket.score}
          maximumScore={maximumScore}
          onRestart={() => window.location.reload()}
          classement={socket.classement}
        />
      </Suspense>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#F4F1EC] text-[#1C1C2E]">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-[#1C1C2E]/95 px-4 backdrop-blur sm:px-6">
        <span className="hidden whitespace-nowrap text-sm font-black text-[#FF7957] sm:block">PIN {socket.pin}</span>
        <ProgressBar
          current={(phase === "quiz" ? questionIndex : circleIndex) + 1}
          total={phase === "quiz" ? questions.length : cercleQs.length}
          color={phase === "quiz" ? "#E8431A" : "#C47A0A"}
          label={phase === "quiz" ? "Question" : "Cercle"}
        />
      </header>

      <button
        type="button"
        onClick={() => setSoundEnabled((current) => !current)}
        className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#1C1C2E] text-white shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60"
        aria-label={soundEnabled ? "Désactiver les sons" : "Activer les sons"}
      >
        {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
      </button>

      <Suspense fallback={<GameScreenFallback />}>
        <AnimatePresence mode="wait">
          {phase === "quiz" ? (
            <motion.div key={`live-question-${questionIndex}`} exit={{ opacity: 0 }}>
              <QuestionCard
                question={currentQuestion}
                selectedIndex={selectedIndex}
                answered={socket.answerRecorded}
                timedOut={timedOut}
                timeLeft={timeLeft}
                onSelect={selectAnswer}
                onContinue={() => undefined}
                isLast={questionIndex === questions.length - 1}
                revealAnswer={answerRevealed}
                showContinue={false}
              />
              {socket.answerRecorded ? (
                <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
                  {!answerRevealed ? (
                    <p className="rounded-xl bg-[#1C1C2E] px-5 py-4 text-center font-black text-white" role="status">
                      Ta réponse est enregistrée ✓ En attente de la révélation...
                    </p>
                  ) : null}
                  <LiveResults options={currentQuestion.opts} liveResults={socket.liveResults} />
                </div>
              ) : null}
            </motion.div>
          ) : null}

          {phase === "cercle" ? (
            <div key={`live-circle-${circleIndex}`}>
              <CircleVoice
                question={cercleQs[circleIndex]}
                answered={circleAnswered}
                onAnswer={answerCircle}
                onContinue={() => undefined}
                isLast={circleIndex === cercleQs.length - 1}
                showContinue={false}
              />
              {circleAnswered ? (
                <div className="mx-auto max-w-4xl px-4 pb-10">
                  <LiveResults
                    options={[
                      { e: "✋", l: "Je me lève" },
                      { e: "🪑", l: "Je reste assise" },
                    ]}
                    liveResults={socket.liveResults}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
