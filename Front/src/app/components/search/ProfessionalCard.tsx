import React, { useState } from "react";
import { MessageCircle, Star, ChevronRight } from "lucide-react";
import { ProfessionalResult } from "../../data/searchData";

interface Props {
  result: ProfessionalResult;
}

const AVATAR_GRADIENTS: Record<string, string> = {
  SM: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
  KB: "linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)",
  AL: "linear-gradient(135deg, #F97316 0%, #F43F5E 100%)",
};

export function ProfessionalCard({ result }: Props) {
  const [hovered, setHovered] = useState(false);
  const gradient = AVATAR_GRADIENTS[result.avatar] || "linear-gradient(135deg, #7C3AED, #A855F7)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-4 transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hovered ? "rgba(16,185,129,0.3)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered
          ? "0 12px 40px rgba(16,185,129,0.12)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Type badge */}
      <span
        className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
        style={{
          background: "#ECFDF5",
          color: "#10B981",
          fontWeight: 700,
          fontSize: "0.6875rem",
        }}
      >
        Professionnel
      </span>

      {/* Profile row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
            style={{
              background: gradient,
              fontWeight: 800,
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {result.avatar}
          </div>
          {/* Availability dot */}
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
            style={{ background: result.available ? "#10B981" : "#F59E0B" }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="truncate"
            style={{ fontWeight: 700, color: "#1a1035", fontSize: "0.9375rem" }}
          >
            {result.name}
          </p>
          <p
            className="text-xs truncate"
            style={{ color: "#9CA3AF", fontWeight: 500 }}
          >
            {result.jobTitle} · {result.company}
          </p>
        </div>
      </div>

      {/* Availability */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-3"
        style={{
          background: result.available ? "#F0FDF4" : "#FFFBEB",
          border: `1px solid ${result.available ? "#BBF7D0" : "#FDE68A"}`,
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: result.available ? "#10B981" : "#F59E0B" }}
        />
        <span
          className="text-xs"
          style={{ color: result.available ? "#059669" : "#B45309", fontWeight: 600 }}
        >
          {result.availabilityLabel}
        </span>
      </div>

      {/* Expertise tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {result.expertise.map((skill) => (
          <span
            key={skill}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "#F3F4F6", color: "#6B7280", fontWeight: 500 }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Sessions */}
      <div
        className="flex items-center gap-1 mb-4"
        style={{ color: "#9CA3AF" }}
      >
        <Star size={12} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
        <span className="text-xs" style={{ fontWeight: 500 }}>
          {result.sessionsCount} sessions mentorat réalisées
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{
            background: hovered ? "linear-gradient(135deg, #10B981, #059669)" : "#ECFDF5",
            color: hovered ? "white" : "#10B981",
            fontWeight: 700,
            border: `1.5px solid ${hovered ? "transparent" : "#6EE7B7"}`,
            boxShadow: hovered ? "0 4px 12px rgba(16,185,129,0.35)" : "none",
          }}
        >
          <MessageCircle size={14} />
          Contacter
        </button>
        <button
          className="px-3 py-2.5 rounded-xl text-sm flex items-center transition-colors"
          style={{
            background: "#F9FAFB",
            color: "#6B7280",
            fontWeight: 600,
            border: "1px solid #E5E7EB",
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
