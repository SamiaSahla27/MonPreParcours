import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, CheckCircle2, Star, Clock, Users, ChevronRight } from "lucide-react";
import { cards } from "../data/cards";

const RELATED_JOBS: Record<string, { title: string; match: number; tag: string }[]> = {
  decouvrir: [
    { title: "Product Designer", match: 94, tag: "Créatif" },
    { title: "Data Analyst", match: 87, tag: "Analytique" },
    { title: "Chef de projet digital", match: 82, tag: "Leadership" },
  ],
  simulateur: [
    { title: "UX Researcher", match: 91, tag: "Recherche" },
    { title: "Ingénieur logiciel", match: 88, tag: "Tech" },
    { title: "Architecte cloud", match: 79, tag: "Infrastructure" },
  ],
  mentoring: [
    { title: "Career Coach", match: 93, tag: "Conseil" },
    { title: "RH & Talent", match: 85, tag: "Humain" },
    { title: "Formateur digital", match: 80, tag: "Pédagogie" },
  ],
  inclusion: [
    { title: "Responsable RSE", match: 96, tag: "Impact" },
    { title: "DEI Manager", match: 89, tag: "Diversité" },
    { title: "Juriste droit social", match: 77, tag: "Droit" },
  ],
  futur: [
    { title: "Prompt Engineer", match: 97, tag: "IA" },
    { title: "AI Ethicist", match: 91, tag: "Éthique" },
    { title: "MLOps Engineer", match: 85, tag: "Machine Learning" },
  ],
};

export function CardDetail() {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  const card = cards.find((c) => c.id === cardId);

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#F8F7FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p style={{ color: "#6B7280" }}>Espace introuvable.</p>
        <Link to="/" style={{ color: "#7C3AED", fontWeight: 600 }}>← Retour au portail</Link>
      </div>
    );
  }

  const Icon = card.icon;
  const relatedJobs = RELATED_JOBS[card.id] || [];

  const handlePrimaryCta = () => {
    if (card.id === "decouvrir") {
      navigate("/orientation-ia");
      return;
    }

    setStarted(true);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F8F7FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: card.gradient,
          minHeight: 240,
        }}
      >
        {/* Decorative circle */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.3)",
            transform: "translate(20%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.4)",
            transform: "translateY(50%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}
          >
            <ArrowLeft size={16} />
            Retour au portail
          </button>

          <div className="flex items-start gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
            >
              <Icon size={28} className="text-white" />
            </div>
            <div>
              <span
                className="inline-block text-xs uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700 }}
              >
                {card.label}
              </span>
              <h1
                style={{
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                  color: "white",
                  lineHeight: 1.2,
                  letterSpacing: "-0.03em",
                  maxWidth: 560,
                }}
              >
                {card.detailTitle}
              </h1>
              <p
                className="mt-2 max-w-lg text-sm"
                style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, fontStyle: "italic" }}
              >
                "{card.need}"
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { icon: Clock, label: "~20 min pour commencer" },
              { icon: Users, label: "12 847 étudiants actifs" },
              { icon: Star, label: "4.8 / 5 étoiles" },
            ].map(({ icon: StatIcon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontWeight: 500,
                }}
              >
                <StatIcon size={13} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Features */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2
              style={{
                fontWeight: 800,
                color: "#1a1035",
                fontSize: "1.25rem",
                letterSpacing: "-0.02em",
              }}
            >
              Ce que tu vas trouver ici
            </h2>

            {card.detailFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className="p-5 rounded-2xl"
                style={{
                  background: "white",
                  border: "1.5px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                    style={{
                      background: card.lightColor,
                      color: card.accentColor,
                      fontWeight: 800,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: 700,
                        color: "#1a1035",
                        fontSize: "1rem",
                        marginBottom: "0.375rem",
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "#6B7280", lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <button
              onClick={handlePrimaryCta}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-base transition-all duration-200 hover:opacity-90"
              style={{
                background: card.gradient,
                color: "white",
                fontWeight: 700,
                boxShadow: `0 8px 32px ${card.accentColor}40`,
                border: "none",
              }}
            >
              {started ? (
                <>
                  <CheckCircle2 size={20} />
                  C'est parti ! 🎉
                </>
              ) : (
                <>
                  {card.ctaLabel}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Right: sidebar */}
          <div className="flex flex-col gap-5">
            {/* Related jobs */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "white",
                border: "1.5px solid rgba(0,0,0,0.06)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              }}
            >
              <h3
                className="mb-4"
                style={{ fontWeight: 700, color: "#1a1035", fontSize: "0.9375rem" }}
              >
                Métiers associés
              </h3>
              <div className="flex flex-col gap-3">
                {relatedJobs.map((job) => (
                  <div
                    key={job.title}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50 cursor-pointer"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: card.lightColor, color: card.accentColor, fontWeight: 700 }}
                    >
                      {job.match}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm truncate"
                        style={{ fontWeight: 600, color: "#1a1035" }}
                      >
                        {job.title}
                      </p>
                      <p className="text-xs" style={{ color: "#9CA3AF" }}>
                        {job.tag}
                      </p>
                    </div>
                    <ChevronRight size={14} style={{ color: "#D1D5DB", flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Explore other spaces */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "white",
                border: "1.5px solid rgba(0,0,0,0.06)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              }}
            >
              <h3
                className="mb-4"
                style={{ fontWeight: 700, color: "#1a1035", fontSize: "0.9375rem" }}
              >
                Autres espaces
              </h3>
              <div className="flex flex-col gap-2">
                {cards
                  .filter((c) => c.id !== card.id)
                  .map((other) => {
                    const OtherIcon = other.icon;
                    return (
                      <button
                        key={other.id}
                        onClick={() => navigate(`/explore/${other.id}`)}
                        className="flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors hover:bg-gray-50"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: other.lightColor }}
                        >
                          <OtherIcon size={15} style={{ color: other.accentColor }} />
                        </div>
                        <span
                          className="text-sm flex-1 min-w-0 truncate"
                          style={{ color: "#374151", fontWeight: 500 }}
                        >
                          {other.label}
                        </span>
                        <ChevronRight size={13} style={{ color: "#D1D5DB", flexShrink: 0 }} />
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
