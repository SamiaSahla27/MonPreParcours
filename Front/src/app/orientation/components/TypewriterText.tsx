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
    <motion.p
      key={text}
      className={className}
      aria-live="polite"
      initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      {text}
    </motion.p>
  );
}
