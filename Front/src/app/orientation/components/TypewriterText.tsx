import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
}

export function TypewriterText({ text, className }: TypewriterTextProps) {
  if (import.meta.env.MODE === "test") {
    return <p className={className}>{text}</p>;
  }

  return (
    <motion.div
      key={text}
      aria-live="polite"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-6 top-1/2 h-10 -translate-y-1/2 rounded-full bg-indigo-300/20 blur-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.55, 0.18], scale: [0.8, 1.08, 1] }}
        transition={{ duration: 0.75, ease: "easeOut" }}
      />
      <motion.p
        className={className}
        initial={{ opacity: 0, scale: 0.985, filter: "blur(3px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
}
