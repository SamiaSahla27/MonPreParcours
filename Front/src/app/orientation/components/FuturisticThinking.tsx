import { motion } from "framer-motion";

const pulseTransition = {
  duration: 1.6,
  repeat: Infinity,
  ease: "easeInOut",
} as const;

export function FuturisticThinking() {
  return (
    <div className="relative flex w-full max-w-3xl flex-col items-center rounded-3xl border border-indigo-200/60 bg-white/70 px-6 py-12 text-center shadow-[0_20px_80px_rgba(88,63,183,0.2)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <motion.div
          className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-indigo-300/20"
          animate={{ x: [0, 18, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-10 bottom-8 h-52 w-52 rounded-full bg-fuchsia-300/20"
          animate={{ x: [0, -22, 0], y: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mb-8 flex h-44 w-44 items-center justify-center">
        <motion.div
          className="absolute h-44 w-44 rounded-full border border-indigo-300/60"
          animate={{ scale: [1, 1.16, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={pulseTransition}
        />
        <motion.div
          className="absolute h-32 w-32 rounded-full border border-indigo-500/70"
          animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.9, 0.35, 0.9] }}
          transition={{ ...pulseTransition, duration: 1.2 }}
        />
        <motion.div
          className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.h2
        className="text-2xl font-extrabold text-indigo-950"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        L'IA analyse ton profil
      </motion.h2>
      <p className="mt-2 max-w-xl text-sm text-indigo-900/80">
        Croisement des preferences, contraintes et objectifs pour generer un parcours
        d'orientation personnalise.
      </p>

      <div className="mt-7 flex items-center gap-2">
        {[0, 1, 2].map((bar) => (
          <motion.span
            key={bar}
            className="h-2 w-8 rounded-full bg-indigo-500"
            animate={{ opacity: [0.2, 1, 0.2], scaleX: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: bar * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
