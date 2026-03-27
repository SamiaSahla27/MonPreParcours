import { motion } from "framer-motion";
import { TimelineStep } from "../types";

interface TimelinePathProps {
  steps: TimelineStep[];
}

export function TimelinePath({ steps }: TimelinePathProps) {
  return (
    <div className="rounded-2xl border border-indigo-200/60 bg-white/80 p-5 shadow-[0_8px_24px_rgba(95,73,187,0.12)]">
      <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-indigo-700">
        Timeline du cursus
      </h4>

      <div className="relative mt-5 space-y-6">
        <div className="absolute left-[11px] top-2 h-[calc(100%-16px)] w-[2px] bg-gradient-to-b from-indigo-500 to-fuchsia-400" />
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="relative pl-9"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
          >
            <span className="absolute left-0 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {index + 1}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700/80">
              {step.yearLabel}
            </p>
            <h5 className="text-base font-semibold text-indigo-950">{step.title}</h5>
            <p className="mt-1 text-sm text-indigo-900/80">{step.focus}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-indigo-950/90">
              {step.milestones.map((milestone) => (
                <li key={milestone} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
                  <span>{milestone}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
