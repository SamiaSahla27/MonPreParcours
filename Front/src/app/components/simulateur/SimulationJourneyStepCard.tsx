import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { type SimulationJourneyStepData } from "../../data/simulations/index";
import { simulationTheme } from "./theme";

interface SimulationJourneyStepCardProps {
  step: SimulationJourneyStepData;
  onOpen: () => void;
}

export function SimulationJourneyStepCard({
  step,
  onOpen,
}: SimulationJourneyStepCardProps) {
  return (
    <Card
      className="rounded-3xl border-0"
      style={{ background: "#FFFFFF", boxShadow: "0 18px 60px rgba(15,23,42,0.08)" }}
    >
      <CardHeader className="px-6 pt-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            className="rounded-full border-0 px-3 py-1 text-[11px] font-extrabold tracking-[0.18em]"
            style={{ background: "#E6F1FB", color: "#0C447C" }}
          >
            {step.tag}
          </Badge>
          <Badge
            className="rounded-full border-0 px-3 py-1 text-xs font-semibold"
            style={{ background: "#F1EFE8", color: "#5F5E5A" }}
          >
            {step.label_type}
          </Badge>
        </div>
        <CardTitle
          className="text-2xl sm:text-3xl"
          style={{ color: "#1A1A1A", fontWeight: 800, letterSpacing: "-0.03em" }}
        >
          {step.titre}
        </CardTitle>
        <CardDescription style={{ color: "#6B7280", lineHeight: 1.8 }}>
          {step.sous_titre}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 sm:px-8">
        <div
          className="rounded-3xl px-5 py-5"
          style={{
            background: "#FFF7ED",
            border: `1px solid ${simulationTheme.orangeBorder}`,
          }}
        >
          <p
            className="text-sm"
            style={{ color: "#9A3412", fontWeight: 700, lineHeight: 1.8 }}
          >
            Passe à la journée type pour vivre les temps forts d'une vraie journée de développeur.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onOpen}
            className="rounded-xl px-5"
            style={{
              background: simulationTheme.accent,
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            Étape suivante
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
