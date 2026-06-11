import { motion } from "framer-motion";
import type { Option } from "./types";

interface OptionButtonProps {
  option: Option;
  index: number;
  selectedIndex: number | null;
  correctIndex?: number;
  answered: boolean;
  isPoll: boolean;
  onSelect: (index: number) => void;
}

export function OptionButton({
  option,
  index,
  selectedIndex,
  correctIndex,
  answered,
  isPoll,
  onSelect,
}: OptionButtonProps) {
  const selected = selectedIndex === index;
  const correct = answered && !isPoll && correctIndex === index;
  const incorrect = answered && !isPoll && selected && correctIndex !== index;

  const background = correct
    ? "#E8F5EE"
    : incorrect
      ? "#FFE8E8"
      : selected
        ? "#FFF0EB"
        : "#FFFFFF";
  const borderColor = correct
    ? "#1A7A4A"
    : incorrect
      ? "#D92D20"
      : selected
        ? "#E8431A"
        : "#E2DDD6";

  return (
    <motion.button
      type="button"
      disabled={answered}
      onClick={() => onSelect(index)}
      className="group relative flex min-h-24 w-full items-center gap-4 rounded-xl border-2 px-4 py-4 text-left shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-orange-300/50 disabled:cursor-default sm:min-h-28"
      style={{ backgroundColor: background, borderColor }}
      whileHover={!answered ? { scale: 1.025, y: -2 } : undefined}
      whileTap={!answered ? { scale: 0.98 } : undefined}
      animate={
        incorrect
          ? { x: [0, -10, 10, -10, 10, 0], backgroundColor: ["#ffffff", "#FFE8E8", "#FFE8E8"] }
          : correct
            ? { scale: [1, 1.05, 1], backgroundColor: ["#ffffff", "#E8F5EE", "#E8F5EE"] }
            : undefined
      }
      transition={{ duration: 0.38 }}
    >
      <span className="text-3xl" aria-hidden="true">{option.e}</span>
      <span className="flex-1 text-sm font-extrabold leading-snug text-[#1C1C2E] sm:text-base">
        {option.l}
      </span>
      {correct ? <span className="text-xl font-black text-[#1A7A4A]">✓</span> : null}
      {incorrect ? <span className="text-xl font-black text-red-600">✕</span> : null}
    </motion.button>
  );
}
