import React, { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { type SimulationScenarioStepData } from "../../data/simulations/index";
import { simulationTheme } from "./theme";

interface SimulationScenarioStepProps {
  step: SimulationScenarioStepData;
  onNext: () => void;
}

export function SimulationScenarioStep({
  step,
  onNext,
}: SimulationScenarioStepProps) {
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(
    null,
  );

  const correctChoiceIds = useMemo(
    () => step.choices.filter((choice) => choice.correct).map((choice) => choice.id ?? choice.label),
    [step.choices],
  );

  const hasWrongChoice = selectedChoiceIds.some((choiceId) => {
    const choice = step.choices.find(
      (item) => (item.id ?? item.label) === choiceId,
    );
    return choice ? !choice.correct : false;
  });

  const hasValidatedAllCorrect = correctChoiceIds.every((choiceId) =>
    selectedChoiceIds.includes(choiceId),
  );

  const canContinue = hasWrongChoice || hasValidatedAllCorrect;

  function handleChoiceClick(choiceId: string) {
    if (selectedChoiceIds.includes(choiceId)) {
      return;
    }

    const choice = step.choices.find((item) => (item.id ?? item.label) === choiceId);

    if (!choice) {
      return;
    }

    setSelectedChoiceIds((current) => [...current, choiceId]);
    setFeedback({ correct: Boolean(choice.correct), text: choice.feedback });
  }

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
          className="rounded-2xl px-5 py-5"
          style={{
            background: "#EFF6FF",
            borderLeft: "4px solid #3B5BDB",
          }}
        >
          <p
            className="text-[11px]"
            style={{ color: "#3B5BDB", fontWeight: 800, letterSpacing: "0.18em" }}
          >
            SCÉNARIO
          </p>
          <p
            className="mt-3 text-lg"
            style={{ color: "#1A1A1A", fontWeight: 700, lineHeight: 1.5 }}
          >
            {step.scenario.texte}
          </p>
          <p className="mt-2 text-sm" style={{ color: "#6B7280", lineHeight: 1.7 }}>
            {step.scenario.consigne}
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {step.choices.map((choice) => {
            const choiceId = choice.id ?? choice.label;
            const selected = selectedChoiceIds.includes(choiceId);
            const palette = selected
              ? choice.correct
                ? { background: "#E1F5EE", border: "#86EFAC", color: "#085041" }
                : { background: "#FEF2F2", border: "#FCA5A5", color: "#991B1B" }
              : { background: "#FFFFFF", border: "#E5E7EB", color: "#1A1A1A" };

            return (
              <button
                key={choiceId}
                onClick={() => handleChoiceClick(choiceId)}
                className="rounded-2xl border px-4 py-4 text-left text-sm transition-all duration-200"
                style={{
                  background: palette.background,
                  borderColor: palette.border,
                  color: palette.color,
                  fontWeight: 600,
                  lineHeight: 1.6,
                }}
              >
                {choice.label}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div
            className="mt-4 rounded-2xl px-4 py-4 text-sm"
            style={{
              background: feedback.correct ? "#E1F5EE" : "#FEF2F2",
              color: feedback.correct ? "#085041" : "#991B1B",
              lineHeight: 1.7,
            }}
          >
            {feedback.text}
          </div>
        )}

        <div
          className="mt-4 rounded-2xl px-4 py-4 text-sm"
          style={{
            background: "#FFF7ED",
            color: "#9A3412",
            lineHeight: 1.7,
          }}
        >
          {step.indice}
        </div>

        {canContinue && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={onNext}
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
        )}
      </CardContent>
    </Card>
  );
}
