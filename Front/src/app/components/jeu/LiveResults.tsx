import { motion } from "framer-motion";
import type { Option } from "./types";
import type { LiveResultats } from "./useJeuSocket";

interface LiveResultsProps {
  options: Option[];
  liveResults: LiveResultats | null;
}

const keys = ["A", "B", "C", "D"] as const;

export function LiveResults({ options, liveResults }: LiveResultsProps) {
  const total = liveResults?.resultats.total ?? 0;

  return (
    <section className="mt-5 rounded-xl border border-[#E2DDD6] bg-white p-5" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black text-[#1C1C2E]">Réponses en direct</h3>
        <span className="text-sm font-bold text-[#5A5A7A]">{liveResults?.responsePercentage ?? 0}% ont répondu</span>
      </div>
      <div className="mt-4 space-y-3">
        {options.map((option, index) => {
          const count = liveResults?.resultats[keys[index]] ?? 0;
          const percent = total === 0 ? 0 : Math.round((count / total) * 100);
          return (
            <div key={option.l}>
              <div className="flex justify-between gap-3 text-sm font-bold">
                <span><span aria-hidden="true">{option.e}</span> {option.l}</span>
                <span>{percent}%</span>
              </div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-[#EDE9E3]">
                <motion.div
                  className="h-full rounded-full bg-[#6A1A8A]"
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
