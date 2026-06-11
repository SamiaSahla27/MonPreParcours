import { motion } from "framer-motion";
import type { CercleQuestion } from "./types";

interface CircleVoiceProps {
  question: CercleQuestion;
  answered: boolean;
  onAnswer: (stoodUp: boolean) => void;
  onContinue: () => void;
  isLast: boolean;
}

const revealColors = {
  all: { accent: "#1A7A4A", soft: "#E8F5EE" },
  girls: { accent: "#E8431A", soft: "#FFF0EB" },
  split: { accent: "#C47A0A", soft: "#FFF8E6" },
} as const;

export function CircleVoice({ question, answered, onAnswer, onContinue, isLast }: CircleVoiceProps) {
  const colors = revealColors[question.type];

  return (
    <motion.section
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="mx-auto w-full max-w-4xl px-4 py-8 text-center sm:px-8 sm:py-12"
    >
      <span className="inline-flex rounded-full bg-[#1C1C2E] px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
        Cercle de vérité
      </span>
      <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-tight text-[#1C1C2E] sm:text-5xl">{question.q}</h2>

      <motion.div
        className="mx-auto my-8 flex h-52 w-52 items-center justify-center rounded-full border-4 px-8 sm:h-64 sm:w-64"
        style={{ borderColor: colors.accent, backgroundColor: colors.soft }}
        animate={{ scale: [1, 1.035, 1], boxShadow: [`0 0 0 0 ${colors.accent}35`, `0 0 0 18px ${colors.accent}00`] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <p className="whitespace-pre-line text-xl font-black leading-tight" style={{ color: colors.accent }}>{question.short}</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          disabled={answered}
          onClick={() => onAnswer(true)}
          whileHover={!answered ? { scale: 1.025 } : undefined}
          whileTap={!answered ? { scale: 0.98 } : undefined}
          className="rounded-xl border-2 border-[#1A7A4A] bg-[#E8F5EE] px-5 py-6 text-lg font-black text-[#1A7A4A] outline-none focus-visible:ring-4 focus-visible:ring-green-300/60 disabled:opacity-60"
        >
          ✋ Je me lève
        </motion.button>
        <motion.button
          type="button"
          disabled={answered}
          onClick={() => onAnswer(false)}
          whileHover={!answered ? { scale: 1.025 } : undefined}
          whileTap={!answered ? { scale: 0.98 } : undefined}
          className="rounded-xl border-2 border-[#D6D1CB] bg-white px-5 py-6 text-lg font-black text-[#5A5A7A] outline-none focus-visible:ring-4 focus-visible:ring-orange-300/50 disabled:opacity-60"
        >
          🪑 Je reste assise
        </motion.button>
      </div>

      {answered ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-5 rounded-xl border-2 p-5 text-left"
          style={{ borderColor: colors.accent, backgroundColor: colors.soft }}
          aria-live="polite"
        >
          <h3 className="text-2xl font-black" style={{ color: colors.accent }}>{question.title}</h3>
          <p className="mt-2 font-semibold leading-7 text-[#1C1C2E]">{question.body}</p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-5 w-full rounded-xl bg-[#1C1C2E] px-5 py-4 font-black text-white outline-none focus-visible:ring-4 focus-visible:ring-orange-300/50"
          >
            {isLast ? "Voir les résultats →" : "Question suivante →"}
          </button>
        </motion.div>
      ) : null}
    </motion.section>
  );
}
