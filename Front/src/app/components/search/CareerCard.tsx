import React, { useState } from "react";
import { Bookmark, BookmarkCheck, ArrowRight, TrendingUp } from "lucide-react";
import { CareerResult } from "../../data/searchData";

interface Props {
  result: CareerResult;
  featured?: boolean;
}

export function CareerCard({ result, featured = false }: Props) {
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);

  const scoreColor =
    result.matchScore >= 90
      ? { text: "#10B981", bg: "#ECFDF5", border: "#6EE7B7" }
      : result.matchScore >= 80
      ? { text: "#7C3AED", bg: "#EDE9FE", border: "#C4B5FD" }
      : { text: "#F97316", bg: "#FFF7ED", border: "#FED7AA" };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: featured
          ? "linear-gradient(135deg, #1a1035 0%, #2D1B69 100%)"
          : "#FFFFFF",
        border: `1.5px solid ${hovered ? (featured ? "#7C3AED" : "rgba(124,58,237,0.25)") : featured ? "rgba(124,58,237,0.3)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered
          ? "0 12px 40px rgba(124,58,237,0.15)"
          : featured
          ? "0 8px 32px rgba(124,58,237,0.2)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {featured && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, #7C3AED, #A855F7, #EC4899)" }}
        />
      )}

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {featured && (
              <span
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-2"
                style={{ background: "rgba(124,58,237,0.3)", color: "#C4B5FD", fontWeight: 700 }}
              >
                ✦ Meilleur résultat IA
              </span>
            )}
            <h3
              className="truncate"
              style={{
                fontWeight: 800,
                fontSize: "1.0625rem",
                color: featured ? "#FFFFFF" : "#1a1035",
                letterSpacing: "-0.02em",
              }}
            >
              {result.title}
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: featured ? "#A78BFA" : "#9CA3AF", fontWeight: 500 }}
            >
              {result.sector}
            </p>
          </div>

          {/* Match score */}
          <div
            className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl"
            style={{
              background: featured ? "rgba(16,185,129,0.15)" : scoreColor.bg,
              border: `1px solid ${featured ? "rgba(16,185,129,0.3)" : scoreColor.border}`,
            }}
          >
            <span
              className="text-lg leading-none"
              style={{ fontWeight: 800, color: featured ? "#34D399" : scoreColor.text }}
            >
              {result.matchScore}%
            </span>
            <span className="text-[10px] mt-0.5" style={{ color: featured ? "#6EE7B7" : scoreColor.text, fontWeight: 600 }}>
              match
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm mb-3 line-clamp-2"
          style={{ color: featured ? "#C4B5FD" : "#4B5563", lineHeight: 1.65 }}
        >
          {result.description}
        </p>

        {/* Match label */}
        <div
          className="flex items-center gap-1.5 mb-3"
        >
          <TrendingUp
            size={13}
            style={{ color: featured ? "#34D399" : scoreColor.text, flexShrink: 0 }}
          />
          <span
            className="text-xs"
            style={{
              color: featured ? "#34D399" : scoreColor.text,
              fontWeight: 600,
            }}
          >
            {result.matchLabel}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: featured ? "rgba(255,255,255,0.1)" : "#F3F4F6",
                color: featured ? "#E9D5FF" : "#6B7280",
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
          <span
            className="text-xs px-2 py-0.5 rounded-full ml-auto"
            style={{
              background: featured ? "rgba(124,58,237,0.2)" : "#F3F4F6",
              color: featured ? "#C4B5FD" : "#9CA3AF",
              fontWeight: 500,
            }}
          >
            {result.salaryRange}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200"
            style={{
              background: featured
                ? "linear-gradient(135deg, #7C3AED, #A855F7)"
                : hovered
                ? "linear-gradient(135deg, #7C3AED, #A855F7)"
                : "#EDE9FE",
              color: featured || hovered ? "#FFFFFF" : "#7C3AED",
              fontWeight: 700,
              boxShadow: (featured || hovered) ? "0 4px 12px rgba(124,58,237,0.35)" : "none",
            }}
          >
            Explorer
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
            style={{
              background: saved
                ? "#EDE9FE"
                : featured
                ? "rgba(255,255,255,0.1)"
                : "#F9FAFB",
              border: `1px solid ${saved ? "#C4B5FD" : featured ? "rgba(255,255,255,0.15)" : "#E5E7EB"}`,
            }}
            title={saved ? "Retiré des favoris" : "Sauvegarder"}
          >
            {saved ? (
              <BookmarkCheck size={16} style={{ color: "#7C3AED" }} />
            ) : (
              <Bookmark size={16} style={{ color: featured ? "#A78BFA" : "#9CA3AF" }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
