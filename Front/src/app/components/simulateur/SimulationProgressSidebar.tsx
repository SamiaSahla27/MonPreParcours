import React from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { type SimulationData } from "../../data/simulations/index";
import { simulationTheme } from "./theme";

interface SimulationProgressSidebarProps {
  simulation: SimulationData;
  activeStepIndex: number;
}

export function SimulationProgressSidebar({
  simulation,
  activeStepIndex,
}: SimulationProgressSidebarProps) {
  const totalSteps = simulation.etapes.length;
  const progress = Math.round(((activeStepIndex + 1) / totalSteps) * 100);

  return (
    <Card
      className="rounded-3xl border-0"
      style={{ background: "#FFFFFF", boxShadow: "0 18px 60px rgba(15,23,42,0.05)" }}
    >
      <CardHeader className="px-6 pt-6">
        <CardTitle style={{ color: "#1A1A1A", fontWeight: 800 }}>
          Progression de mission
        </CardTitle>
        <CardDescription style={{ color: "#6B7280", lineHeight: 1.7 }}>
          Tu avances étape par étape, comme dans un vrai mini projet.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div
          className="flex items-center justify-between text-sm"
          style={{ color: "#4B5563", fontWeight: 700 }}
        >
          <span>{`Étape ${activeStepIndex + 1} sur ${totalSteps}`}</span>
          <span>{progress}%</span>
        </div>

        <div
          className="mt-3 h-3 w-full overflow-hidden rounded-full"
          style={{ background: "#F3F4F6" }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, background: simulationTheme.accent }}
          />
        </div>

        <div className="mt-6 space-y-3">
          {simulation.etapes.map((step, index) => {
            const isDone = index < activeStepIndex;
            const isActive = index === activeStepIndex;
            const isLocked = index > activeStepIndex;

            return (
              <div
                key={step.id}
                className="rounded-2xl border px-4 py-4"
                style={{
                  background: isDone ? "#E1F5EE" : isActive ? "#FFF7ED" : "#F9FAFB",
                  borderColor: isDone
                    ? "#86EFAC"
                    : isActive
                      ? simulationTheme.orangeBorder
                      : "#E5E7EB",
                  opacity: isLocked ? 0.55 : 1,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background: "#FFFFFF",
                      color: isDone ? "#15905F" : isActive ? simulationTheme.accent : "#9CA3AF",
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>

                  <div>
                    <p
                      className="text-sm"
                      style={{
                        color: "#1A1A1A",
                        fontWeight: isActive ? 800 : 700,
                      }}
                    >
                      {step.label_type}
                    </p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      {step.tag}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
