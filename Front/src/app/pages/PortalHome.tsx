import React from "react";
import { CalendarDays } from "lucide-react";
import { HeroGreeting } from "../components/HeroGreeting";
import { ExplorationCard } from "../components/ExplorationCard";
import { cards, type CardData } from "../data/cards";

export function PortalHome() {
  const evenementsCard: CardData = {
    id: "rencontres",
    label: "RENCONTRES PRO",
    need: "Je veux découvrir des entreprises et rencontrer des pros en vrai",
    description: "Journées portes ouvertes, afterworks, immersions en entreprise",
    accentColor: cards[1]?.accentColor ?? "#F97316",
    lightColor: cards[1]?.lightColor ?? "#FFF7ED",
    textOnAccent: "#FFFFFF",
    icon: CalendarDays,
    gradient: cards[1]?.gradient ?? "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
    detailTitle: "Découvrir des rencontres",
    detailFeatures: [],
    ctaLabel: "Voir les rencontres",
  };

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
            {/* TODO: Simulations — désactivé temporairement, à réactiver quand prêt */}
            {/*
            <ExplorationCard card={cards[1]} />
            */}
            <ExplorationCard card={evenementsCard} href="/rencontres" />
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
