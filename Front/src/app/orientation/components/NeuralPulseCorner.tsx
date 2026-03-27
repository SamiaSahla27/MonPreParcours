import { motion } from "framer-motion";

export function NeuralPulseCorner() {
  return (
    <div className="pointer-events-none absolute right-8 top-28 hidden h-44 w-44 lg:block">
      <motion.div
        className="absolute inset-0 rounded-full border border-indigo-300/50"
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.15, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-6 rounded-full border border-fuchsia-300/70"
        animate={{ scale: [1.1, 0.92, 1.1], opacity: [0.2, 0.65, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
        animate={{ scale: [0.7, 1.3, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
