import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search } from "lucide-react";

const SUGGESTIONS = [
  "UX Designer",
  "Intelligence artificielle",
  "Marketing digital",
  "Développeur web",
  "Data Scientist",
];

interface Props {
  query: string;
  onSuggestionClick: (s: string) => void;
}

export function EmptyState({ query, onSuggestionClick }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center text-center py-20 px-4"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Illustration */}
      <div
        className="relative w-32 h-32 mb-8 flex items-center justify-center rounded-full"
        style={{ background: "linear-gradient(135deg, #EDE9FE 0%, #F0F9FF 100%)" }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-50 animate-ping"
          style={{ background: "rgba(124,58,237,0.08)", animationDuration: "3s" }}
        />
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #EDE9FE 0%, #E0F2FE 100%)" }}
        >
          <Search size={36} style={{ color: "#C4B5FD" }} />
        </div>
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-base"
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          🤔
        </div>
      </div>

      {/* Message */}
      <h2
        style={{
          fontWeight: 800,
          fontSize: "1.5rem",
          color: "#1a1035",
          letterSpacing: "-0.03em",
          marginBottom: "0.5rem",
        }}
      >
        Aucun résultat pour «{" "}
        <span style={{ color: "#7C3AED" }}>{query}</span> »
      </h2>
      <p
        className="max-w-md mb-8"
        style={{ color: "#9CA3AF", lineHeight: 1.7, fontSize: "0.9375rem" }}
      >
        On n'a pas trouvé de correspondance exacte. Essaie une autre formulation ou
        explore nos suggestions ci-dessous.
      </p>

      {/* Suggestions */}
      <div className="mb-8">
        <p
          className="text-sm mb-3"
          style={{ color: "#6B7280", fontWeight: 600 }}
        >
          Suggestions populaires
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick(s)}
              className="px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:shadow-md"
              style={{
                background: "white",
                border: "1.5px solid rgba(124,58,237,0.2)",
                color: "#7C3AED",
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Back CTA */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all duration-200 hover:opacity-80"
        style={{
          background: "linear-gradient(135deg, #7C3AED, #A855F7)",
          color: "white",
          fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
        }}
      >
        <ArrowLeft size={15} />
        Retour au portail
      </button>
    </div>
  );
}
