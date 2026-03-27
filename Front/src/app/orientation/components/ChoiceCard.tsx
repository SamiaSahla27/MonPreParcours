import { motion } from "framer-motion";

interface ChoiceCardProps {
  label: string;
  helper?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function ChoiceCard({
  label,
  helper,
  selected = false,
  disabled = false,
  onClick,
}: ChoiceCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group w-full rounded-2xl border p-4 text-left shadow-[0_8px_30px_rgba(80,52,180,0.10)] backdrop-blur transition ${
        selected
          ? "border-indigo-600 bg-indigo-50/90"
          : "border-indigo-200/60 bg-white/75"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <p className="text-base font-semibold text-indigo-950">{label}</p>
      {helper ? (
        <p className="mt-1 text-sm text-indigo-700/80 transition-colors group-hover:text-indigo-700">
          {helper}
        </p>
      ) : null}
    </motion.button>
  );
}
