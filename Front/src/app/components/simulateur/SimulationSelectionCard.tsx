import React from "react";
import { useNavigate } from "react-router";
import { Clock3, Play, Sparkles } from "lucide-react";
import {
  categoryLabels,
  levelLabels,
  type SimulationCategory,
  type SimulationData,
} from "../../data/simulations/index";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { simulationTheme } from "./theme";

const categoryStyles: Record<
  SimulationCategory,
  { background: string; color: string }
> = {
  tech: { background: "#E6F1FB", color: "#0C447C" },
  sante: { background: "#E1F5EE", color: "#085041" },
  commerce: { background: "#FAEEDA", color: "#633806" },
  social: { background: "#EEEDFE", color: "#3C3489" },
  "art-design": { background: "#FBEAF0", color: "#72243E" },
  droit: { background: "#F1EFE8", color: "#444441" },
  nature: { background: "#EAF3DE", color: "#27500A" },
};

const levelStyles = {
  decouverte: { background: "#F1EFE8", color: "#5F5E5A" },
  intermediaire: { background: "#EEEDFE", color: "#3C3489" },
  avance: { background: "#FBEAF0", color: "#72243E" },
} as const;

interface SimulationSelectionCardProps {
  simulation: SimulationData;
}

export function SimulationSelectionCard({
  simulation,
}: SimulationSelectionCardProps) {
  const navigate = useNavigate();
  const categoryStyle = categoryStyles[simulation.categorie];
  const levelStyle = levelStyles[simulation.niveau];

  return (
    <Card
      className="h-full rounded-3xl border"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(229,227,220,1)",
        boxShadow: "0 12px 38px rgba(15,23,42,0.06)",
      }}
    >
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs"
              style={{
                background: categoryStyle.background,
                color: categoryStyle.color,
                fontWeight: 700,
              }}
            >
              {categoryLabels[simulation.categorie]}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs"
              style={{
                background: levelStyle.background,
                color: levelStyle.color,
                fontWeight: 700,
              }}
            >
              {levelLabels[simulation.niveau]}
            </span>
          </div>

          {typeof simulation.compatibilityScore === "number" && (
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
              style={{
                background: "#F1EFE8",
                color: "#444441",
                fontWeight: 700,
              }}
            >
              <Sparkles size={13} color={simulationTheme.accent} />
              {simulation.compatibilityScore}%
            </span>
          )}
        </div>

        <div>
          <h2
            className="text-xl"
            style={{
              color: "#1A1A1A",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            {simulation.titre.replace("Je suis ", "").replace(" pendant 1h", "")}
          </h2>
          <p
            className="mt-2 line-clamp-2 text-sm"
            style={{ color: "#6B6B6B", lineHeight: 1.7 }}
          >
            {simulation.description}
          </p>
        </div>

        <div
          className="mt-auto flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "#E5E3DC" }}
        >
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "#6B6B6B", fontWeight: 600 }}
          >
            <Clock3 size={16} color={simulationTheme.accent} />
            {simulation.duree}
          </div>

          <Button
            onClick={() => navigate(`/simulations/${simulation.slug}`)}
            className="rounded-xl px-5"
            style={{
              background: simulationTheme.accent,
              color: "#FFFFFF",
              fontWeight: 700,
              boxShadow: `0 14px 32px ${simulationTheme.orangeBorder}`,
            }}
          >
            <Play size={16} />
            Lancer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
