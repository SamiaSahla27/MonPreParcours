import { motion } from "framer-motion";
import type { Question } from "./types";
import { FeedbackPanel } from "./FeedbackPanel";
import { OptionButton } from "./OptionButton";

interface QuestionCardProps {
  question: Question;
  selectedIndex: number | null;
  answered: boolean;
  timeLeft: number;
  onSelect: (index: number) => void;
  onContinue: () => void;
  isLast: boolean;
}

const moduleColors: Record<Question["mod"], { accent: string; soft: string }> = {
  images: { accent: "#2856A8", soft: "#E8EEFF" },
  memory: { accent: "#6A1A8A", soft: "#F5E8FF" },
  vrfx: { accent: "#C47A0A", soft: "#FFF8E6" },
  maison: { accent: "#1A7A4A", soft: "#E8F5EE" },
  bienveillant: { accent: "#E8431A", soft: "#FFF0EB" },
  emotions: { accent: "#A01A4A", soft: "#FFE8F0" },
  chiffres: { accent: "#2856A8", soft: "#E8EEFF" },
};

const sceneColors: Record<NonNullable<Question["visual"]>["type"], string> = {
  "scene-office": "#DFE8FF",
  "scene-medical": "#D9F2E8",
  "scene-pilote": "#DFE9FF",
  "scene-voiture": "#FFE5D5",
  "scene-maison": "#FFF0CE",
  "scene-emotion": "#EDDDFD",
  "scene-sport": "#DDF6E7",
  "scene-chantier": "#FFE4D1",
};

export function QuestionCard({
  question,
  selectedIndex,
  answered,
  timeLeft,
  onSelect,
  onContinue,
  isLast,
}: QuestionCardProps) {
  const colors = moduleColors[question.mod];
  const circumference = 2 * Math.PI * 22;
  const timerOffset = circumference * (1 - timeLeft / 20);

  return (
    <motion.section
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <span
            className="inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider"
            style={{ color: colors.accent, backgroundColor: colors.soft }}
          >
            {question.modLabel}
          </span>
          <h2 className="mt-4 max-w-3xl text-2xl font-black leading-tight text-[#1C1C2E] sm:text-4xl">
            {question.question}
          </h2>
        </div>
        <div className="relative h-14 w-14 shrink-0" aria-label={`${timeLeft} secondes restantes`}>
          <svg className="-rotate-90" width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#E2DDD6" strokeWidth="5" />
            <motion.circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke={timeLeft <= 5 ? "#D92D20" : colors.accent}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: timerOffset }}
              transition={{ duration: 0.25 }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-[#1C1C2E]">
            {timeLeft}
          </span>
        </div>
      </div>

      {question.visual ? (
        <div
          className={`relative mb-5 flex min-h-44 flex-col items-center justify-center overflow-hidden rounded-xl text-center sm:min-h-52 ${
            question.visual.image ? "" : "px-5 py-7"
          }`}
          style={{ backgroundColor: sceneColors[question.visual.type] }}
        >
          {question.visual.label ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#5A5A7A] shadow-sm backdrop-blur">
              {question.visual.label}
            </span>
          ) : null}
          {question.visual.timer ? (
            <span className="absolute right-3 top-3 rounded-full bg-[#C47A0A] px-3 py-1 text-xs font-black text-white">
              {question.visual.timer}
            </span>
          ) : null}
          {question.visual.image ? (
            <div className={`grid w-full ${question.visual.secondImage ? "grid-cols-1 sm:grid-cols-2" : ""}`}>
              <img
                src={question.visual.image}
                alt={question.visual.imageAlt ?? question.visual.scene}
                loading={question.id === 1 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={question.id === 1 ? "high" : "auto"}
                className="aspect-[16/9] h-full w-full object-cover"
              />
              {question.visual.secondImage ? (
                <img
                  src={question.visual.secondImage}
                  alt={question.visual.secondImageAlt ?? question.visual.scene}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/9] h-full w-full object-cover"
                />
              ) : null}
            </div>
          ) : (
            <>
              <span className="mb-3 text-5xl sm:text-7xl" aria-hidden="true">{question.visual.figures}</span>
              <p className="max-w-xl text-sm font-bold leading-6 text-[#1C1C2E]/65">{question.visual.scene}</p>
            </>
          )}
        </div>
      ) : null}

      {question.isPoll ? (
        <p className="mb-4 rounded-lg border border-[#C47A0A] bg-[#FFF8E6] px-4 py-2 text-center text-sm font-bold text-[#9B6208]">
          💡 Pas de bonne ou mauvaise réponse — suis ton instinct !
        </p>
      ) : null}

      <div className={`grid gap-3 ${question.colClass === "col1" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        {question.opts.map((option, index) => (
          <OptionButton
            key={`${question.id}-${option.l}`}
            option={option}
            index={index}
            selectedIndex={selectedIndex}
            correctIndex={question.correct}
            answered={answered}
            isPoll={question.isPoll}
            onSelect={onSelect}
          />
        ))}
      </div>

      {answered ? (
        <div className="mt-5 space-y-4">
          <FeedbackPanel feedback={question.fb} />
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onContinue}
            className="w-full rounded-xl bg-[#1C1C2E] px-5 py-4 text-base font-black text-white outline-none transition hover:bg-[#30304A] focus-visible:ring-4 focus-visible:ring-orange-300/50"
          >
            {isLast ? "Passer à la partie 2 →" : "Continuer →"}
          </motion.button>
        </div>
      ) : null}
    </motion.section>
  );
}
