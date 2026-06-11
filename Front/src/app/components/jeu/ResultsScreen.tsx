import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ShareResult } from "./ShareResult";
import { getScoreMessage } from "./scoring";

interface ResultsScreenProps {
  score: number;
  maximumScore: number;
  onRestart: () => void;
}

const lessons = [
  { icon: "🧠", title: "Ton cerveau complète les blancs", body: "Un biais n'est pas une faute morale. C'est un raccourci qu'on peut apprendre à repérer." },
  { icon: "🔎", title: "Les images influencent nos choix", body: "Les mêmes gestes ne sont pas interprétés de la même façon selon le genre de la personne." },
  { icon: "🚀", title: "L'orientation doit rester ouverte", body: "Les compétences n'ont pas de genre. La confiance et les modèles comptent énormément." },
  { icon: "🤝", title: "La liberté profite à tout le monde", body: "Sortir des stéréotypes libère les filles comme les garçons." },
];

const quote = "Aucun métier n'est réservé. Aucun rêve n'est trop grand.";

export function ResultsScreen({ score, maximumScore, onRestart }: ResultsScreenProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [typedQuote, setTypedQuote] = useState("");
  const scoreMessage = getScoreMessage(score);

  useEffect(() => {
    confetti({ particleCount: 180, spread: 95, origin: { y: 0.65 }, colors: ["#E8431A", "#6A1A8A", "#C47A0A", "#1A7A4A"] });
  }, []);

  useEffect(() => {
    const duration = 900;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      setDisplayScore(Math.round(score * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedQuote(quote.slice(0, index));
      if (index >= quote.length) window.clearInterval(timer);
    }, 38);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="min-h-[calc(100vh-72px)] bg-white">
      <div className="bg-[#1C1C2E] px-4 py-14 text-center text-white sm:px-8">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="block text-7xl" aria-hidden="true">🎉</motion.span>
        <h2 className="mt-5 text-4xl font-black sm:text-6xl">Tes réflexes ont parlé.</h2>
        <p className="mt-4 text-white/65">Et maintenant, tu sais mieux les questionner.</p>
        <div className="mx-auto mt-8 w-fit rounded-xl border border-white/15 bg-white/10 px-8 py-5">
          <p className="text-5xl font-black text-[#FF7957]">{displayScore}<span className="text-2xl text-white/55">/{maximumScore}</span></p>
          <p className="mt-1 text-xs font-black uppercase tracking-widest text-white/55">points</p>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-5 text-xl font-black text-white sm:text-2xl"
        >
          {scoreMessage}
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        className="mx-auto max-w-4xl px-4 py-10 sm:px-8"
      >
        <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#5A5A7A]">Ce que tu peux retenir</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {lessons.map((lesson) => (
            <motion.article
              key={lesson.title}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="rounded-xl border border-[#E2DDD6] bg-[#F8F6F2] p-5"
            >
              <span className="text-2xl" aria-hidden="true">{lesson.icon}</span>
              <h3 className="mt-3 font-black text-[#1C1C2E]">{lesson.title}</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#5A5A7A]">{lesson.body}</p>
            </motion.article>
          ))}
        </div>

        <div className="my-6 min-h-32 rounded-xl bg-[#E8431A] p-6 text-center text-2xl font-black leading-snug text-white sm:text-3xl">
          “{typedQuote}”
          <span className="animate-pulse">|</span>
        </div>

        <div className="space-y-3">
          <ShareResult score={score} maximumScore={maximumScore} message={scoreMessage} />
          <button
            type="button"
            onClick={onRestart}
            className="w-full rounded-xl border-2 border-[#1C1C2E] bg-white px-5 py-4 font-black text-[#1C1C2E] outline-none transition hover:bg-[#1C1C2E] hover:text-white focus-visible:ring-4 focus-visible:ring-orange-300/50"
          >
            Rejouer
          </button>
        </div>
      </motion.div>
    </section>
  );
}
