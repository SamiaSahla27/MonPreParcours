import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  color: string;
  label: string;
}

export function ProgressBar({ current, total, color, label }: ProgressBarProps) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3" aria-label={`${label} ${current} sur ${total}`}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/15">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <span className="whitespace-nowrap text-xs font-extrabold text-white/75">
        {current}/{total}
      </span>
    </div>
  );
}
