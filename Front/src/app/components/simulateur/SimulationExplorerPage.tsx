import React, { useMemo, useState } from "react";
import {
  simulationCatalog,
  type SimulationFilterKey,
} from "../../data/simulations/index";
import { SimulationFilters } from "./SimulationFilters";
import { SimulationHeader } from "./SimulationHeader";
import { SimulationSelectionCard } from "./SimulationSelectionCard";

export function SimulationExplorerPage() {
  const [activeFilter, setActiveFilter] = useState<SimulationFilterKey>("tous");

  const filteredSimulations = useMemo(() => {
    if (activeFilter === "tous") {
      return simulationCatalog;
    }

    return simulationCatalog.filter(
      (simulation) => simulation.categorie === activeFilter,
    );
  }, [activeFilter]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(249,115,22,0.08), transparent 24%), linear-gradient(180deg, #FFFCF8 0%, #F8FAFC 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <SimulationHeader
          compact
          tag="SIMULATIONS"
          title="Choisir une simulation"
          description="Explore un métier de l'intérieur. Choisis et lance."
        />

        <div className="mt-8">
          <SimulationFilters
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredSimulations.map((simulation) => (
            <SimulationSelectionCard
              key={simulation.slug}
              simulation={simulation}
            />
          ))}
        </div>

        {filteredSimulations.length === 0 && (
          <div
            className="mt-8 rounded-3xl px-6 py-8 text-center"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E3DC",
              color: "#6B6B6B",
            }}
          >
            Aucune simulation disponible dans cette catégorie pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
