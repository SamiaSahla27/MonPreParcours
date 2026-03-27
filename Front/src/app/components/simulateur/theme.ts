import { cards } from "../../data/cards";

const simulationCard = cards.find((card) => card.id === "simulateur");

export const simulationTheme = {
  accent: simulationCard?.accentColor ?? "#F97316",
  light: simulationCard?.lightColor ?? "#FFF7ED",
  gradient:
    simulationCard?.gradient ?? "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
  missionGradient: "linear-gradient(135deg, #1E3A8A 0%, #3B5BDB 100%)",
  orangeBorder: "rgba(249,115,22,0.28)",
};
