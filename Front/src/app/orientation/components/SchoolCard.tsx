import { motion } from "framer-motion";
import { SchoolRecommendation } from "../types";

interface SchoolCardProps {
  school: SchoolRecommendation;
}

export function SchoolCard({ school }: SchoolCardProps) {
  const statusColors =
    school.status === "Public"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-indigo-200/70 bg-white/80 p-4 shadow-[0_8px_24px_rgba(95,73,187,0.12)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h5 className="text-base font-bold text-indigo-950">{school.name}</h5>
          <p className="text-sm text-indigo-700/80">{school.city}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors}`}>
          {school.status}
        </span>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-indigo-950/90">
        <p>
          <span className="font-semibold">Formation:</span> {school.program}
        </p>
        <p>
          <span className="font-semibold">Duree:</span> {school.duration}
        </p>
        <p>
          <span className="font-semibold">Cout:</span> {school.annualCost}
        </p>
      </div>

      <p className="mt-3 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900">
        {school.whyItFits}
      </p>
    </motion.article>
  );
}
