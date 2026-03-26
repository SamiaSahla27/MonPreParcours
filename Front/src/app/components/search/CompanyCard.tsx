import React, { useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { CompanyResult } from "../../data/searchData";

interface Props {
  result: CompanyResult;
}

const LOGO_COLORS: Record<string, string> = {
  DC: "linear-gradient(135deg, #1a1035 0%, #2D1B69 100%)",
  LD: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
  LV: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
};

export function CompanyCard({ result }: Props) {
  const [hovered, setHovered] = useState(false);
  const gradient = LOGO_COLORS[result.logo] || "linear-gradient(135deg, #F43F5E, #E11D48)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-4 transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hovered ? "rgba(244,63,94,0.25)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered
          ? "0 12px 40px rgba(244,63,94,0.1)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Type badge */}
      <span
        className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
        style={{
          background: "#FFF1F2",
          color: "#F43F5E",
          fontWeight: 700,
          fontSize: "0.6875rem",
        }}
      >
        Entreprise engagée
      </span>

      {/* Company header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{
            background: gradient,
            fontWeight: 800,
            fontSize: "0.9375rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}
        >
          {result.logo}
        </div>
        <div>
          <p style={{ fontWeight: 700, color: "#1a1035", fontSize: "0.9375rem" }}>
            {result.name}
          </p>
          <p className="text-xs" style={{ color: "#9CA3AF", fontWeight: 500 }}>
            {result.sector}
          </p>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-xs mb-3 line-clamp-2"
        style={{ color: "#4B5563", lineHeight: 1.65 }}
      >
        {result.description}
      </p>

      {/* Labels */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {result.labels.map((label) => (
          <span
            key={label.text}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: label.bg,
              color: label.color,
              fontWeight: 700,
              border: `1px solid ${label.color}30`,
            }}
          >
            {label.text}
          </span>
        ))}
      </div>

      {/* Diversity score bar */}
      {result.diversityScore && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: "#9CA3AF", fontWeight: 500 }}>
              Score diversité & inclusion
            </span>
            <span className="text-xs" style={{ color: "#F43F5E", fontWeight: 700 }}>
              {result.diversityScore}/100
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: "#FFF1F2" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${result.diversityScore}%`,
                background: "linear-gradient(90deg, #F43F5E, #FB7185)",
              }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200"
        style={{
          background: hovered ? "linear-gradient(135deg, #F43F5E, #E11D48)" : "#FFF1F2",
          color: hovered ? "white" : "#F43F5E",
          fontWeight: 700,
          border: `1.5px solid ${hovered ? "transparent" : "#FECDD3"}`,
          boxShadow: hovered ? "0 4px 12px rgba(244,63,94,0.35)" : "none",
        }}
      >
        <Heart size={14} />
        Voir les actions
        <ArrowRight size={13} />
      </button>
    </div>
  );
}
