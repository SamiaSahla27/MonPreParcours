import React from "react";
import { Flame } from "lucide-react";

const STEPS = [
  { label: "Profil créé", done: true },
  { label: "Quiz complété", done: true },
  { label: "Simulation", done: false },
  { label: "Mentor trouvé", done: false },
  { label: "Parcours finalisé", done: false },
];

export function HeroGreeting() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 40%, #F0F9FF 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #0EA5E9 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Greeting */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                style={{
                  background: "rgba(124,58,237,0.12)",
                  color: "#7C3AED",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                <Flame size={12} />
                Streak de 3 jours 🔥
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                lineHeight: 1.15,
                color: "#1a1035",
                letterSpacing: "-0.03em",
              }}
            >
              Bonjour Emma 👋
            </h1>
            <p
              className="mt-2 max-w-lg"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#6B7280",
                fontSize: "1.0625rem",
                lineHeight: 1.6,
              }}
            >
              Par où veux-tu commencer aujourd'hui ?{" "}
              <span style={{ color: "#7C3AED", fontWeight: 600 }}>5 espaces t'attendent</span>{" "}
              pour construire ton avenir professionnel.
            </p>
          </div>

          {/* Progress tracker */}
          <div
            className="flex-shrink-0 p-5 rounded-2xl w-full lg:w-80"
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(124,58,237,0.12)",
              boxShadow: "0 4px 24px rgba(124,58,237,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  color: "#1a1035",
                  fontSize: "0.9375rem",
                }}
              >
                Mon parcours
              </p>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  color: "#7C3AED",
                  fontSize: "0.9375rem",
                }}
              >
                45%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full mb-5" style={{ background: "#EDE9FE" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: "45%",
                  background: "linear-gradient(90deg, #7C3AED 0%, #A855F7 100%)",
                }}
              />
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-2">
              {STEPS.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={{
                      background: step.done ? "#7C3AED" : "#EDE9FE",
                      color: step.done ? "white" : "#C4B5FD",
                      fontWeight: 700,
                    }}
                  >
                    {step.done ? "✓" : i + 1}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.8125rem",
                      color: step.done ? "#374151" : "#9CA3AF",
                      fontWeight: step.done ? 600 : 400,
                      textDecoration: step.done ? "none" : "none",
                    }}
                  >
                    {step.label}
                  </span>
                  {i === 2 && (
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "#FFF7ED",
                        color: "#F97316",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Suivant
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
