import React, { useState } from "react";
import { BookOpen, Clock, Shield, ExternalLink } from "lucide-react";
import { ResourceResult } from "../../data/searchData";

interface Props {
  result: ResourceResult;
}

function ResilienceBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "#10B981" : score >= 60 ? "#F97316" : "#F43F5E";
  const label =
    score >= 80 ? "Très résistant" : score >= 60 ? "Résistant" : "Vulnérable";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: "#6B7280", fontWeight: 500 }}
        >
          <Shield size={11} style={{ color }} />
          Résilience face à l'IA
        </span>
        <span className="text-xs" style={{ color, fontWeight: 700 }}>
          {score}/100 · {label}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full" style={{ background: "#F3F4F6" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function ResourceCard({ result }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-4 transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hovered ? "rgba(14,165,233,0.3)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered
          ? "0 12px 40px rgba(14,165,233,0.1)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span
            className="inline-block text-xs px-2 py-0.5 rounded-full mb-2"
            style={{
              background: "#F0F9FF",
              color: "#0EA5E9",
              fontWeight: 700,
              fontSize: "0.6875rem",
            }}
          >
            Ressource IA
          </span>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#EDE9FE", color: "#7C3AED", fontWeight: 600 }}
            >
              {result.tag}
            </span>
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "#9CA3AF" }}
            >
              <Clock size={11} />
              {result.readTime}
            </span>
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "#F0F9FF",
            border: "1px solid #BAE6FD",
          }}
        >
          <BookOpen size={18} style={{ color: "#0EA5E9" }} />
        </div>
      </div>

      {/* Title */}
      <h3
        className="mb-2 line-clamp-2"
        style={{
          fontWeight: 700,
          fontSize: "0.9375rem",
          color: "#1a1035",
          lineHeight: 1.4,
          letterSpacing: "-0.01em",
        }}
      >
        {result.title}
      </h3>

      {/* Description */}
      <p
        className="text-xs mb-3 line-clamp-2"
        style={{ color: "#4B5563", lineHeight: 1.65 }}
      >
        {result.description}
      </p>

      {/* Source */}
      <p className="text-xs mb-3" style={{ color: "#9CA3AF" }}>
        Source :{" "}
        <span style={{ color: "#6B7280", fontWeight: 600 }}>{result.source}</span>
      </p>

      {/* Resilience score */}
      <div className="mb-4">
        <ResilienceBar score={result.resilienceScore} />
      </div>

      {/* CTA */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200"
        style={{
          background: hovered ? "linear-gradient(135deg, #0EA5E9, #0284C7)" : "#F0F9FF",
          color: hovered ? "white" : "#0EA5E9",
          fontWeight: 700,
          border: `1.5px solid ${hovered ? "transparent" : "#BAE6FD"}`,
          boxShadow: hovered ? "0 4px 12px rgba(14,165,233,0.35)" : "none",
        }}
      >
        <BookOpen size={14} />
        Lire l'article
        <ExternalLink size={12} />
      </button>
    </div>
  );
}
