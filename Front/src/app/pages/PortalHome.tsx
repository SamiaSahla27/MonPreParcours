import React from "react";
import { HeroGreeting } from "../components/HeroGreeting";
import { ExplorationCard } from "../components/ExplorationCard";
import { cards } from "../data/cards";

export function PortalHome() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#F8F7FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <HeroGreeting />

      {/* Main cards section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "1.375rem",
                color: "#1a1035",
                letterSpacing: "-0.02em",
              }}
            >
              Tes espaces d'exploration
            </h2>
            <p
              className="text-sm mt-0.5"
              style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Clique sur une carte pour commencer
            </p>
            <div
              className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs"
              style={{
                background: "linear-gradient(135deg, #6D28D9 0%, #A21CAF 100%)",
                color: "#FFFFFF",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(109, 40, 217, 0.28)",
              }}
            >
              <span>Orientation IA</span>
            </div>
          </div>
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{
              background: "#EDE9FE",
              color: "#7C3AED",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
            }}
          >
            <span>5 espaces disponibles</span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Row 1: Featured card (col-span-2) + Card 2 */}
          <div className="sm:col-span-2 lg:col-span-2">
            <ExplorationCard card={cards[0]} featured />
          </div>
          <div className="sm:col-span-1">
            <ExplorationCard card={cards[1]} />
          </div>

          {/* Row 2: Cards 3, 4, 5 equal width */}
          <div className="sm:col-span-1">
            <ExplorationCard card={cards[2]} />
          </div>
          <div className="sm:col-span-1">
            <ExplorationCard card={cards[3]} />
          </div>
          <div className="sm:col-span-1">
            <ExplorationCard card={cards[4]} />
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-10 text-center">
          <p
            className="text-sm"
            style={{ color: "#C4B5FD", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ✦ Propulsé par l'IA pour ton avenir
          </p>
        </div>
      </main>
    </div>
  );
}
