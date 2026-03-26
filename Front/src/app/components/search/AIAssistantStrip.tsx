import React, { useState } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";

interface Props {
  query: string;
}

export function AIAssistantStrip({ query }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const getMessage = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes("design") || lower.includes("créat"))
      return {
        message:
          "Basé sur ton profil, les métiers créatifs et visuels semblent particulièrement te correspondre.",
        cta: "Affiner avec le quiz",
        detail: "Veux-tu explorer davantage cette direction ?",
      };
    if (lower.includes("ia") || lower.includes("intelligence"))
      return {
        message:
          "L'IA est un secteur en pleine évolution. Plusieurs métiers émergents correspondent à ton profil analytique.",
        cta: "Voir les métiers IA",
        detail: "Découvre les rôles les plus résistants à l'automatisation.",
      };
    return {
      message: `Tes résultats pour « ${q} » révèlent un fort potentiel dans des métiers créatifs et technologiques.`,
      cta: "Affiner avec le quiz",
      detail: "Veux-tu des suggestions encore plus personnalisées ?",
    };
  };

  const { message, cta, detail } = getMessage(query);

  return (
    <div
      className="relative flex items-start gap-4 p-4 rounded-2xl mb-6 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1035 0%, #2D1B69 100%)",
        border: "1px solid rgba(124,58,237,0.4)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #A855F7 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      {/* AI Icon */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #7C3AED, #A855F7)",
          boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
        }}
      >
        <Sparkles size={18} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(124,58,237,0.4)", color: "#C4B5FD", fontWeight: 700 }}
          >
            OrientIA · Intelligence
          </span>
        </div>
        <p className="text-sm" style={{ color: "#E9D5FF", lineHeight: 1.6 }}>
          {message}{" "}
          <span style={{ color: "#A78BFA" }}>{detail}</span>
        </p>
        <button
          className="mt-3 flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80"
          style={{ color: "#C4B5FD", fontWeight: 700 }}
        >
          {cta}
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 relative z-10"
      >
        <X size={14} style={{ color: "#A78BFA" }} />
      </button>
    </div>
  );
}
