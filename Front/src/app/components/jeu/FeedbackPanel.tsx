import { motion } from "framer-motion";
import type { Feedback } from "./types";

interface FeedbackPanelProps {
  feedback: Feedback;
}

const styles = {
  insight: { background: "#E8F5EE", border: "#1A7A4A" },
  shock: { background: "#FFF0EB", border: "#E8431A" },
  info: { background: "#FFF8E6", border: "#C47A0A" },
} as const;

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  const colors = styles[feedback.type];

  return (
    <motion.aside
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border-2 p-5"
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
      aria-live="polite"
    >
      <p className="mb-2 text-xs font-black uppercase tracking-widest" style={{ color: colors.border }}>
        {feedback.lbl}
      </p>
      <p className="text-sm font-semibold leading-7 text-[#1C1C2E] sm:text-base">{feedback.txt}</p>
    </motion.aside>
  );
}
