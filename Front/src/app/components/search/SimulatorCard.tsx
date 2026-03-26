import React, { useState } from "react";
import { Play, Clock, Users, Zap } from "lucide-react";
import { SimulatorResult } from "../../data/searchData";

interface Props {
  result: SimulatorResult;
}

const DIFFICULTY_CONFIG = {
  Débutant: { color: "#10B981", bg: "#ECFDF5" },
  Intermédiaire: { color: "#F97316", bg: "#FFF7ED" },
  Avancé: { color: "#F43F5E", bg: "#FFF1F2" },
};

export function SimulatorCard({ result }: Props) {
  const [hovered, setHovered] = useState(false);
  const diff = DIFFICULTY_CONFIG[result.difficulty];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hovered ? result.color + "40" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered
          ? `0 12px 40px ${result.color}20`
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Visual preview area */}
      <div
        className="relative h-28 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${result.color}15 0%, ${result.color}08 100%)`,
          borderBottom: `1px solid ${result.color}15`,
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-3 right-3 w-20 h-20 rounded-full opacity-10"
          style={{ background: result.color }}
        />
        <div
          className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-10"
          style={{ background: result.color }}
        />

        {/* Play button */}
        <div
          className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300"
          style={{
            background: `linear-gradient(135deg, ${result.color}, ${result.color}CC)`,
            boxShadow: `0 8px 24px ${result.color}50`,
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          <Play size={22} className="text-white" style={{ marginLeft: 2 }} />
        </div>

        {/* Type badge */}
        <span
          className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full"
          style={{
            background: result.color,
            color: "white",
            fontWeight: 700,
            fontSize: "0.6875rem",
          }}
        >
          Simulation
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="mb-1 line-clamp-2"
          style={{
            fontWeight: 700,
            fontSize: "0.9375rem",
            color: "#1a1035",
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
          }}
        >
          {result.title}
        </h3>
        <p
          className="text-xs mb-3 line-clamp-2"
          style={{ color: "#9CA3AF", lineHeight: 1.6 }}
        >
          {result.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "#6B7280", fontWeight: 500 }}
          >
            <Clock size={12} style={{ color: result.color }} />
            {result.duration}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: diff.bg, color: diff.color, fontWeight: 600 }}
          >
            {result.difficulty}
          </span>
          <span
            className="flex items-center gap-1 text-xs ml-auto"
            style={{ color: "#9CA3AF" }}
          >
            <Users size={11} />
            {result.participants.toLocaleString("fr-FR")}
          </span>
        </div>

        {/* CTA */}
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{
            background: hovered
              ? `linear-gradient(135deg, ${result.color}, ${result.color}CC)`
              : `${result.color}15`,
            color: hovered ? "white" : result.color,
            fontWeight: 700,
            border: `1.5px solid ${hovered ? "transparent" : result.color + "30"}`,
            boxShadow: hovered ? `0 4px 12px ${result.color}40` : "none",
          }}
        >
          <Zap size={14} />
          Lancer la simulation
        </button>
      </div>
    </div>
  );
}
