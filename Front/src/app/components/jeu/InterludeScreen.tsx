import { motion } from "framer-motion";

interface InterludeScreenProps {
  score: number;
  maximumScore: number;
  onContinue: () => void;
}

const steps = [
  "L'animatrice lit la question à voix haute.",
  "Celles qui répondent oui se lèvent.",
  "On observe ensemble qui se lève.",
  "On découvre l'enseignement et on échange.",
];

export function InterludeScreen({ score, maximumScore, onContinue }: InterludeScreenProps) {
  return (
    <section className="min-h-[calc(100vh-72px)] bg-[#11111D] px-4 py-12 text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-168px)] max-w-4xl flex-col justify-center">
        <motion.span
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          className="mb-6 text-7xl"
          aria-hidden="true"
        >
          🙋
        </motion.span>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#FF7957]">
          Partie 2 sur 2
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black leading-none sm:text-6xl"
        >
          Le cercle
          <span className="block text-[#E8431A]">de vérité</span>
        </motion.h2>
        <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/65">
          Partie 1 terminée : tu as marqué {score} points sur {maximumScore}. Pose le téléphone et joue avec le groupe.
        </p>

        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.13 }}
              className="flex items-center gap-4 py-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8431A] text-sm font-black">{index + 1}</span>
              <p className="font-bold text-white/85">{step}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={onContinue}
          className="mt-10 w-full rounded-xl bg-white px-6 py-5 text-lg font-black text-[#1C1C2E] outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          On y va →
        </motion.button>
      </div>
    </section>
  );
}
