import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { CardData } from "../data/cards";

interface ExplorationCardProps {
  card: CardData;
  featured?: boolean;
}

export function ExplorationCard({ card, featured = false }: ExplorationCardProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const Icon = card.icon;
  const isPrimaryOrientation = featured && card.id === "decouvrir";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/explore/${card.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/explore/${card.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer outline-none focus-visible:ring-2"
      style={{
        background: isPrimaryOrientation
          ? "linear-gradient(165deg, #ffffff 0%, #f7f1ff 100%)"
          : "#FFFFFF",
        border: `1.5px solid ${
          isPrimaryOrientation
            ? hovered
              ? card.accentColor + "80"
              : card.accentColor + "55"
            : hovered
              ? card.accentColor + "40"
              : "rgba(0,0,0,0.06)"
        }`,
        boxShadow: hovered
          ? `0 24px 64px ${card.accentColor}30, 0 6px 18px rgba(0,0,0,0.08)`
          : isPrimaryOrientation
            ? `0 12px 34px ${card.accentColor}1f, inset 0 0 0 1px ${card.accentColor}22`
            : "0 2px 12px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px) scale(1.005)" : "translateY(0) scale(1)",
        transition: "all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
        height: "100%",
        minHeight: featured ? 280 : 220,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {isPrimaryOrientation ? (
        <>
          <div
            className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full blur-3xl"
            style={{ background: `${card.accentColor}44` }}
          />
          <div
            className="pointer-events-none absolute -right-16 bottom-10 h-44 w-44 rounded-full blur-3xl"
            style={{ background: "#a855f744" }}
          />
        </>
      ) : null}

      {/* Badge */}
      {card.badge && (
        <div
          className="absolute top-4 right-4 z-10 text-xs px-2.5 py-1 rounded-full"
          style={{
            background: card.badge === "Recommandé" ? "#7C3AED" : "#0EA5E9",
            color: "white",
            fontWeight: 700,
            fontSize: "0.6875rem",
            letterSpacing: "0.02em",
            boxShadow: isPrimaryOrientation
              ? `0 6px 16px ${card.accentColor}7a`
              : `0 2px 8px ${card.accentColor}55`,
          }}
        >
          {card.badge === "Recommandé" ? "⭐ " : "✨ "}
          {card.badge}
        </div>
      )}

      {/* Colored header */}
      <div
        className="flex-shrink-0 flex items-end justify-between px-5 pt-5 pb-4"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${card.accentColor}${isPrimaryOrientation ? "32" : "18"} 0%, ${card.accentColor}14 100%)`
            : `linear-gradient(135deg, ${card.accentColor}${isPrimaryOrientation ? "22" : "0D"} 0%, ${card.accentColor}09 100%)`,
          borderBottom: `1px solid ${card.accentColor}15`,
          transition: "background 0.28s ease",
        }}
      >
        <div>
          {/* Label */}
          <span
            className="inline-block text-xs uppercase tracking-widest mb-3"
            style={{ color: card.accentColor, fontWeight: 700, letterSpacing: "0.08em" }}
          >
            {card.label}
          </span>
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: card.gradient,
              boxShadow: isPrimaryOrientation
                ? `0 8px 24px ${card.accentColor}66`
                : `0 4px 16px ${card.accentColor}40`,
              transform: hovered
                ? "scale(1.08) rotate(-2deg)"
                : isPrimaryOrientation
                  ? "scale(1.04)"
                  : "scale(1) rotate(0deg)",
              transition: "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <Icon size={22} className="text-white" />
          </div>
        </div>

        {/* Decorative accent circle */}
        <div
          className="w-20 h-20 rounded-full opacity-10"
          style={{
            background: card.gradient,
            transform: "translate(25%, 25%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Need (first-person quote) */}
        <blockquote
          className="flex-1 relative"
        >
          <span
            className="absolute -top-1 -left-1 text-3xl leading-none opacity-20"
            style={{ color: card.accentColor }}
          >
            "
          </span>
          <p
            className="pl-4 text-sm leading-relaxed"
            style={{ color: "#374151", fontStyle: "italic" }}
          >
            {card.need}
          </p>
        </blockquote>

        {/* Description */}
        <p
          className="text-xs"
          style={{ color: isPrimaryOrientation ? "#6b7280" : "#9CA3AF", lineHeight: 1.6 }}
        >
          {card.description}
        </p>

        {/* CTA Button */}
        <button
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{
              background: isPrimaryOrientation || hovered ? card.gradient : card.lightColor,
              color: isPrimaryOrientation || hovered ? "white" : card.accentColor,
            fontWeight: 700,
              border: `1.5px solid ${(isPrimaryOrientation || hovered) ? "transparent" : card.accentColor + "30"}`,
              boxShadow: isPrimaryOrientation || hovered ? `0 6px 18px ${card.accentColor}44` : "none",
          }}
          onClick={(e) => { e.stopPropagation(); navigate(`/explore/${card.id}`); }}
        >
          {card.ctaLabel}
          <ArrowRight
            size={15}
            style={{
              transform: hovered ? "translateX(2px)" : "translateX(0)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
      </div>
    </div>
  );
}