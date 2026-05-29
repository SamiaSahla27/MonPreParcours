import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  categoryLabels,
  type JourneySlotState,
  type SimulationData,
  type SimulationJourneyData,
} from "../../data/simulations/index";
import { simulationTheme } from "./theme";

interface RuntimeSlot {
  id: string;
  heure: string;
  titre: string;
  description: string;
  state: JourneySlotState;
  choices: { label: string; feedback: string }[];
  selectedChoiceIndex: number | null;
  feedback: string | null;
}

interface SimulationJourneyTimelineProps {
  simulation: SimulationData;
  journey: SimulationJourneyData;
}

export function SimulationJourneyTimeline({
  simulation,
  journey,
}: SimulationJourneyTimelineProps) {
  const [slots, setSlots] = useState<RuntimeSlot[]>(() =>
    journey.slots.map((slot) => ({
      ...slot,
      selectedChoiceIndex: null,
      feedback: null,
    })),
  );

  useEffect(() => {
    setSlots(
      journey.slots.map((slot) => ({
        ...slot,
        selectedChoiceIndex: null,
        feedback: null,
      })),
    );
  }, [journey]);

  const compatibilityLabel = useMemo(() => {
    if (typeof simulation.compatibilityScore !== "number") {
      return null;
    }

    return `${simulation.compatibilityScore}% de compatibilité`;
  }, [simulation.compatibilityScore]);

  function handleChoiceSelect(slotIndex: number, choiceIndex: number) {
    const slot = slots[slotIndex];

    if (!slot || slot.state !== "active" || slot.selectedChoiceIndex !== null) {
      return;
    }

    setSlots((current) =>
      current.map((item, index) =>
        index === slotIndex
          ? {
              ...item,
              selectedChoiceIndex: choiceIndex,
              feedback: item.choices[choiceIndex]?.feedback ?? null,
            }
          : item,
      ),
    );

    window.setTimeout(() => {
      setSlots((current) =>
        current.map((item, index) => {
          if (index === slotIndex) {
            return { ...item, state: "done" };
          }

          if (index === slotIndex + 1 && item.state === "locked") {
            return { ...item, state: "active" };
          }

          return item;
        }),
      );
    }, 600);
  }

  return (
    <Card
      className="rounded-3xl border-0"
      style={{ background: "#FFFFFF", boxShadow: "0 18px 60px rgba(15,23,42,0.08)" }}
    >
      <CardHeader className="px-6 pt-6 sm:px-8">
        <CardTitle
          className="text-2xl sm:text-3xl"
          style={{ color: "#1A1A1A", fontWeight: 800, letterSpacing: "-0.03em" }}
        >
          Journée type
        </CardTitle>
        <CardDescription style={{ color: "#6B7280", lineHeight: 1.8 }}>
          Une timeline simple pour voir comment un développeur priorise, communique et termine sa journée.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 sm:px-8">
        <div className="space-y-6">
          {slots.map((slot, index) => {
            const isDone = slot.state === "done";
            const isActive = slot.state === "active";
            const isLocked = slot.state === "locked";
            const dotColor = isDone ? "#15905F" : isActive ? simulationTheme.accent : "#9CA3AF";

            return (
              <div key={slot.id} className="grid grid-cols-[56px_20px_1fr] gap-4">
                <div className="pt-2 text-sm" style={{ color: "#6B7280", fontWeight: 700 }}>
                  {slot.heure}
                </div>

                <div className="flex flex-col items-center">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: dotColor }} />
                  {index < slots.length - 1 && (
                    <span className="mt-2 w-px flex-1" style={{ background: "#E5E7EB", minHeight: 72 }} />
                  )}
                </div>

                <div
                  className="rounded-3xl border px-5 py-5"
                  style={{
                    background: isActive ? "#FFF7ED" : "#FFFFFF",
                    borderColor: isActive ? simulationTheme.orangeBorder : "#E5E7EB",
                    opacity: isLocked ? 0.4 : 1,
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg" style={{ color: "#1A1A1A", fontWeight: 800 }}>
                        {slot.titre}
                      </h3>
                      <p className="mt-2 text-sm" style={{ color: "#6B7280", lineHeight: 1.7 }}>
                        {slot.description}
                      </p>
                    </div>

                    {slot.id === "slot-18h" && compatibilityLabel && (
                      <span
                        className="rounded-full px-3 py-1 text-xs"
                        style={{
                          background: "#F1EFE8",
                          color: "#444441",
                          fontWeight: 700,
                        }}
                      >
                        {compatibilityLabel}
                      </span>
                    )}
                  </div>

                  {!isLocked && slot.choices.length > 0 && (
                    <div className="mt-4 grid gap-3">
                      {slot.choices.map((choice, choiceIndex) => {
                        const selected = slot.selectedChoiceIndex === choiceIndex;

                        return (
                          <button
                            key={choice.label}
                            onClick={() => handleChoiceSelect(index, choiceIndex)}
                            disabled={slot.selectedChoiceIndex !== null}
                            className="rounded-2xl border px-4 py-4 text-left text-sm transition-all duration-200 disabled:cursor-default"
                            style={{
                              background: selected ? "#FFF7ED" : "#FFFFFF",
                              borderColor: selected ? simulationTheme.orangeBorder : "#E5E7EB",
                              color: "#1A1A1A",
                              fontWeight: 600,
                              lineHeight: 1.6,
                            }}
                          >
                            {choice.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!isLocked && slot.feedback && (
                    <div
                      className="mt-4 rounded-2xl px-4 py-4 text-sm"
                      style={{
                        background: "#FFF7ED",
                        color: "#9A3412",
                        lineHeight: 1.7,
                      }}
                    >
                      {slot.feedback}
                    </div>
                  )}

                  {slot.id === "slot-18h" && !isLocked && (
                    <div
                      className="mt-4 rounded-2xl px-4 py-4 text-sm"
                      style={{
                        background: "#F8FAFC",
                        color: "#475569",
                        lineHeight: 1.8,
                      }}
                    >
                      Bilan de la simulation {categoryLabels[simulation.categorie]} : tu as vu comment un développeur arbitre ses priorités, parle à des profils différents et accompagne l'équipe.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
