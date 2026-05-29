import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { SimulationBreadcrumb } from "../components/simulateur/SimulationBreadcrumb";
import { SimulationHeader } from "../components/simulateur/SimulationHeader";
import { SimulationJourneyStepCard } from "../components/simulateur/SimulationJourneyStepCard";
import { SimulationProgressSidebar } from "../components/simulateur/SimulationProgressSidebar";
import { SimulationScenarioStep } from "../components/simulateur/SimulationScenarioStep";
import {
  getSimulationBySlug,
  type SimulationJourneyStepData,
  type SimulationScenarioStepData,
} from "../data/simulations/index";

export function SimulationMissionPage() {
  const navigate = useNavigate();
  const { slug = "developpeur-1h" } = useParams();
  const simulation = getSimulationBySlug(slug);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const activeStep = useMemo(
    () => simulation?.etapes[activeStepIndex],
    [activeStepIndex, simulation],
  );

  if (!simulation || !activeStep) {
    return <div className="mx-auto max-w-5xl px-4 py-12">Simulation introuvable.</div>;
  }

  function handleNext() {
    const nextStep = simulation.etapes[activeStepIndex + 1];

    if (!nextStep) {
      return;
    }

    if (nextStep.type === "journee") {
      navigate(nextStep.redirect);
      return;
    }

    setActiveStepIndex((current) => current + 1);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(191,219,254,0.85), transparent 28%), linear-gradient(180deg, #F8FBFF 0%, #F8F7FF 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <SimulationBreadcrumb />

        <div className="mt-5">
          <SimulationHeader
            tag="MISSION MÉTIER"
            title={simulation.titre}
            description={simulation.description}
            badges={simulation.badges}
            useMissionGradient
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            {activeStep.type === "scenario" ? (
              <SimulationScenarioStep
                step={activeStep as SimulationScenarioStepData}
                onNext={handleNext}
              />
            ) : (
              <SimulationJourneyStepCard
                step={activeStep as SimulationJourneyStepData}
                onOpen={() => navigate(activeStep.redirect)}
              />
            )}
          </div>

          <div>
            <SimulationProgressSidebar
              simulation={simulation}
              activeStepIndex={activeStepIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
