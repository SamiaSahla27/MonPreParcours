import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function SimulationBreadcrumb() {
  return (
    <Link
      to="/explore/simulateur"
      className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-75"
      style={{ color: "#1D4ED8", fontWeight: 700 }}
    >
      <ArrowLeft size={16} />
      Retour aux simulations
    </Link>
  );
}
