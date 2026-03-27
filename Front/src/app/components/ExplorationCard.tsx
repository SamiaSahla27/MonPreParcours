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

  const handleClick = () => {
    if (card.id === "inclusion") {
      navigate("/engaged-companies");
    } else {
      navigate(`/explore/${card.id}`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer outline-none focus-visible:ring-2"
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hovered ? card.accentColor + "40" : "rgba(0,0,0,0.06)"}`,
        boxShadow: hovered
          ? `0 20px 60px ${card.accentColor}22, 0 4px 16px rgba(0,0,0,0.06)`
          : "0 2px 12px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px) scale(1.005)" : "translateY(0) scale(1)",
        transition: "all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
        height: "100%",
        minHeight: featured ? 260 : 220,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
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
            boxShadow: `0 2px 8px ${card.accentColor}55`,
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
            ? `linear-gradient(135deg, ${card.accentColor}18 0%, ${card.accentColor}08 100%)`
            : `linear-gradient(135deg, ${card.accentColor}0D 0%, ${card.accentColor}05 100%)`,
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
              boxShadow: `0 4px 16px ${card.accentColor}40`,
              transform: hovered ? "scale(1.08) rotate(-2deg)" : "scale(1) rotate(0deg)",
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
          style={{ color: "#9CA3AF", lineHeight: 1.6 }}
        >
          {card.description}
        </p>

        {/* CTA Button */}
        <button
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm transition-all duration-200"
          style={{
            background: hovered ? card.gradient : card.lightColor,
            color: hovered ? "white" : card.accentColor,
            fontWeight: 700,
            border: `1.5px solid ${hovered ? "transparent" : card.accentColor + "30"}`,
            boxShadow: hovered ? `0 4px 16px ${card.accentColor}40` : "none",
          }}
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
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