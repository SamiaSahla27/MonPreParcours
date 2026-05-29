import React from "react";
import { useParams } from "react-router";
import { SimulationBreadcrumb } from "../components/simulateur/SimulationBreadcrumb";
import { SimulationHeader } from "../components/simulateur/SimulationHeader";
import { SimulationJourneyTimeline } from "../components/simulateur/SimulationJourneyTimeline";
import { SimulationProgressSidebar } from "../components/simulateur/SimulationProgressSidebar";
import {
  getSimulationBySlug,
  getSimulationJourneyBySlug,
  getSimulationStepIndex,
} from "../data/simulations/index";

export function SimulationJourneePage() {
  const { slug = "developpeur-1h" } = useParams();
  const simulation = getSimulationBySlug(slug);
  const journey = getSimulationJourneyBySlug(slug);

  if (!simulation || !journey) {
    return <div className="mx-auto max-w-5xl px-4 py-12">Journée type introuvable.</div>;
  }

  const activeStepIndex = Math.max(getSimulationStepIndex(simulation, "journee"), 0);

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
            tag="JOURNÉE TYPE"
            title={simulation.titre}
            description={simulation.description}
            badges={simulation.badges}
            useMissionGradient
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <SimulationJourneyTimeline
              simulation={simulation}
              journey={journey}
            />
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
