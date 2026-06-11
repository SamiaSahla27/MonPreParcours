import { useEffect, useMemo, useState } from "react";
import { BarChart3, LockKeyhole, Users } from "lucide-react";
import { questions } from "../components/jeu/data";
import {
  GAME_SYNC_KEY,
  readLiveGameState,
  writeLiveGameState,
  type LiveGameState,
} from "../components/jeu/sync";

const ACCESS_CODE = "ellesbougent2024";

export function JeuAnimatricePage() {
  const [authorized, setAuthorized] = useState(
    () => window.sessionStorage.getItem("jeu-animatrice-authorized") === "true",
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [liveState, setLiveState] = useState<LiveGameState>(() => readLiveGameState());

  useEffect(() => {
    const refresh = () => setLiveState(readLiveGameState());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === GAME_SYNC_KEY) refresh();
    };
    window.addEventListener("storage", handleStorage);
    const interval = window.setInterval(refresh, 750);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.clearInterval(interval);
    };
  }, []);

  const question = questions[Math.min(liveState.questionIndex, questions.length - 1)];
  const counts = liveState.responses[String(question.id)] ?? question.opts.map(() => 0);
  const responseCount = liveState.respondents[String(question.id)]?.length ?? 0;
  const participantCount = liveState.participants.length;
  const responsePercentage = participantCount === 0
    ? 0
    : Math.min(100, Math.round((responseCount / participantCount) * 100));
  const largestCount = useMemo(() => Math.max(1, ...counts), [counts]);

  const unlock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code !== ACCESS_CODE) {
      setError("Code incorrect");
      return;
    }
    window.sessionStorage.setItem("jeu-animatrice-authorized", "true");
    setAuthorized(true);
    setError("");
  };

  const nextQuestion = () => {
    const nextIndex = Math.min(questions.length - 1, liveState.questionIndex + 1);
    const nextState = { ...readLiveGameState(), questionIndex: nextIndex };
    writeLiveGameState(nextState);
    setLiveState(nextState);
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
            autoComplete="current-password"
          />
          {error ? <p className="mt-2 text-sm font-bold text-red-300" role="alert">{error}</p> : null}
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

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#11111D] px-5 py-8 text-white sm:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FF7957]">
              Question {liveState.questionIndex + 1} / {questions.length}
            </p>
            <h1 className="mt-3 max-w-5xl text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
              {question.question}
            </h1>
          </div>
          <div className="flex gap-3">
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
              <Users size={18} className="inline text-[#FF7957]" aria-hidden="true" />
              <span className="ml-2 font-black">{participantCount}</span>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
              <BarChart3 size={18} className="inline text-[#FF7957]" aria-hidden="true" />
              <span className="ml-2 font-black">{responsePercentage}%</span>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-5 lg:grid-cols-2" aria-label="Statistiques des réponses">
          {question.opts.map((option, index) => {
            const percent = Math.round((counts[index] / largestCount) * 100);
            return (
              <article key={option.l} className="overflow-hidden rounded-lg border border-white/15 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xl font-black"><span aria-hidden="true">{option.e}</span> {option.l}</p>
                  <span className="text-2xl font-black text-[#FF7957]">{counts[index]}</span>
                </div>
                <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#E8431A] transition-[width] duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </article>
            );
          })}
        </section>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-white/70">
            {responseCount} participante{responseCount > 1 ? "s" : ""} sur {participantCount} ont répondu
          </p>
          <button
            type="button"
            onClick={nextQuestion}
            disabled={liveState.questionIndex >= questions.length - 1}
            className="rounded-lg bg-white px-7 py-4 font-black text-[#1C1C2E] outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Question suivante →
          </button>
        </div>
      </div>
    </main>
  );
}
