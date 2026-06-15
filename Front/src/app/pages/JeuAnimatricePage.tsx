import { useEffect, useMemo, useState } from "react";
import { BarChart3, LockKeyhole, Play, Users } from "lucide-react";
import { cercleQs, questions } from "../components/jeu/data";
import { LiveResults } from "../components/jeu/LiveResults";
import { useJeuSocket } from "../components/jeu/useJeuSocket";

const ACCESS_CODE = "ellesbougent2024";

export function JeuAnimatricePage() {
  const socket = useJeuSocket("animatrice");
  const [authorized, setAuthorized] = useState(
    () => window.sessionStorage.getItem("jeu-animatrice-authorized") === "true",
  );
  const [code, setCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const [phase, setPhase] = useState<"lobby" | "quiz" | "cercle" | "termine">("lobby");
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);

  const quizQuestion = questions[Math.max(0, Math.min(questionIndex, questions.length - 1))];
  const circleQuestion = cercleQs[Math.max(0, Math.min(questionIndex, cercleQs.length - 1))];
  const displayedOptions = phase === "cercle"
    ? [{ e: "✋", l: "Je me lève" }, { e: "🪑", l: "Je reste assise" }]
    : quizQuestion.opts;
  const displayedQuestion = phase === "cercle" ? circleQuestion.q : quizQuestion.question;
  const responseCount = socket.liveResults?.resultats.total ?? 0;
  const progressLabel = useMemo(() => {
    if (phase === "quiz") return `Question ${questionIndex + 1} / ${questions.length}`;
    if (phase === "cercle") return `Cercle ${questionIndex + 1} / ${cercleQs.length}`;
    return "Session Elles Bougent";
  }, [phase, questionIndex]);

  useEffect(() => {
    const liveQuestion = socket.currentQuestion;
    if (!liveQuestion || liveQuestion.phase === "lobby" || liveQuestion.phase === "pause") return;
    if (liveQuestion.phase === "termine") {
      setPhase("termine");
      return;
    }
    setPhase(liveQuestion.phase);
    setQuestionIndex(
      liveQuestion.phase === "cercle"
        ? Math.max(0, liveQuestion.questionIndex - questions.length)
        : liveQuestion.questionIndex,
    );
  }, [socket.currentQuestion]);

  const unlock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code !== ACCESS_CODE) {
      setAccessError("Code incorrect");
      return;
    }
    window.sessionStorage.setItem("jeu-animatrice-authorized", "true");
    setAuthorized(true);
    setAccessError("");
  };

  const createSession = async () => {
    setBusy(true);
    await socket.createSession(ACCESS_CODE);
    setBusy(false);
  };

  const launchQuestion = async (nextIndex: number, nextPhase: "quiz" | "cercle") => {
    setBusy(true);
    const serverIndex = nextPhase === "cercle" ? questions.length + nextIndex : nextIndex;
    const result = await socket.nextQuestion(serverIndex, nextPhase);
    if (result.ok) {
      setPhase(nextPhase);
      setQuestionIndex(nextIndex);
      setRevealed(false);
    }
    setBusy(false);
  };

  const reveal = async () => {
    const result = await socket.revealAnswer(
      questionIndex,
      phase === "quiz" ? quizQuestion.correct : undefined,
    );
    if (result.ok) setRevealed(true);
  };

  const advance = async () => {
    if (phase === "quiz" && questionIndex < questions.length - 1) {
      await launchQuestion(questionIndex + 1, "quiz");
      return;
    }
    if (phase === "quiz") {
      await launchQuestion(0, "cercle");
      return;
    }
    if (phase === "cercle" && questionIndex < cercleQs.length - 1) {
      await launchQuestion(questionIndex + 1, "cercle");
      return;
    }
    const result = await socket.endGame();
    if (result.ok) setPhase("termine");
  };

  if (!authorized) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#1C1C2E] px-4 text-white">
        <form onSubmit={unlock} className="w-full max-w-sm">
          <LockKeyhole className="mb-5 text-[#FF7957]" size={42} aria-hidden="true" />
          <h1 className="text-3xl font-black">Mode animatrice</h1>
          <label htmlFor="animatrice-code" className="mt-7 block text-sm font-bold text-white/70">
            Code d'accès
          </label>
          <input
            id="animatrice-code"
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-2 w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-white outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60"
          />
          {accessError ? <p className="mt-2 text-sm font-bold text-red-300" role="alert">{accessError}</p> : null}
          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-[#E8431A] px-5 py-4 font-black outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          >
            Accéder au direct
          </button>
        </form>
      </main>
    );
  }

  if (!socket.joined) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#11111D] px-4 text-center text-white">
        <div className="max-w-lg">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF7957]">Elles Bougent</p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">Prête à animer ?</h1>
          <p className="mt-4 font-semibold text-white/60">
            Crée une session puis partage le PIN affiché avec les participantes.
          </p>
          {socket.error ? <p className="mt-4 font-bold text-red-300">{socket.error}</p> : null}
          <button
            type="button"
            onClick={() => void createSession()}
            disabled={!socket.connected || busy}
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#E8431A] px-8 py-5 text-lg font-black outline-none focus-visible:ring-4 focus-visible:ring-white/60 disabled:opacity-45"
          >
            <Play size={21} aria-hidden="true" />
            {busy ? "Création..." : "Créer une session"}
          </button>
        </div>
      </main>
    );
  }

  if (phase === "lobby") {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#11111D] px-4 py-10 text-center text-white">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7957]">PIN de la session</p>
        <h1 className="mt-4 text-7xl font-black tracking-[0.12em] sm:text-9xl">{socket.pin}</h1>
        <div className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-5 py-3">
          <Users className="text-[#FF7957]" size={22} aria-hidden="true" />
          <span className="text-xl font-black">{socket.participantCount} participante{socket.participantCount > 1 ? "s" : ""}</span>
        </div>
        <button
          type="button"
          onClick={() => void launchQuestion(0, "quiz")}
          disabled={busy}
          className="mt-10 rounded-xl bg-white px-8 py-5 text-lg font-black text-[#1C1C2E] outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60 disabled:opacity-45"
        >
          Lancer la question 1
        </button>
      </main>
    );
  }

  if (phase === "termine") {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#11111D] px-4 text-center text-white">
        <div>
          <p className="text-7xl" aria-hidden="true">🎉</p>
          <h1 className="mt-5 text-5xl font-black">Jeu terminé</h1>
          <p className="mt-4 font-semibold text-white/60">Les résultats finaux sont affichés sur les téléphones.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#11111D] px-5 py-8 text-white sm:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FF7957]">{progressLabel}</p>
            <h1 className="mt-3 max-w-5xl text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
              {displayedQuestion}
            </h1>
          </div>
          <div className="flex gap-3">
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
              <Users size={18} className="inline text-[#FF7957]" aria-hidden="true" />
              <span className="ml-2 font-black">{socket.participantCount}</span>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
              <BarChart3 size={18} className="inline text-[#FF7957]" aria-hidden="true" />
              <span className="ml-2 font-black">{socket.liveResults?.responsePercentage ?? 0}%</span>
            </div>
          </div>
        </header>

        <LiveResults options={displayedOptions} liveResults={socket.liveResults} />

        {revealed && phase === "quiz" && quizQuestion.correct !== undefined ? (
          <p className="mt-5 rounded-lg bg-green-900/40 px-5 py-4 text-xl font-black text-green-200">
            Bonne réponse : {displayedOptions[quizQuestion.correct]?.l}
          </p>
        ) : null}

        <footer className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-white/70">
            {responseCount} participante{responseCount > 1 ? "s" : ""} sur {socket.participantCount} ont répondu
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void reveal()}
              disabled={revealed}
              className="rounded-lg border border-white/30 px-6 py-4 font-black outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60 disabled:opacity-40"
            >
              Révéler la réponse
            </button>
            <button
              type="button"
              onClick={() => void advance()}
              className="rounded-lg bg-white px-7 py-4 font-black text-[#1C1C2E] outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60"
            >
              {phase === "cercle" && questionIndex === cercleQs.length - 1 ? "Afficher les résultats" : "Question suivante →"}
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
