import React from "react";
import { simulationFilters, type SimulationFilterKey } from "../../data/simulations/index";
import { simulationTheme } from "./theme";

interface SimulationFiltersProps {
  activeFilter: SimulationFilterKey;
  onChange: (filter: SimulationFilterKey) => void;
}

export function SimulationFilters({
  activeFilter,
  onChange,
}: SimulationFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {simulationFilters.map((filter) => {
        const active = filter.key === activeFilter;

        return (
          <button
            key={filter.key}
            onClick={() => onChange(filter.key)}
            className="rounded-full px-4 py-2 text-sm transition-all duration-200"
            style={{
              background: active ? simulationTheme.accent : "#FFFFFF",
              color: active ? "#FFFFFF" : "#6B7280",
              border: `1px solid ${active ? simulationTheme.accent : "#D1D5DB"}`,
              fontWeight: active ? 700 : 600,
              boxShadow: active ? `0 10px 24px ${simulationTheme.orangeBorder}` : "none",
            }}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
