import React from "react";
import { Code2, Play, Rocket, Target, Zap } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { type SimulationBadgeData } from "../../data/simulations/index";
import { simulationTheme } from "./theme";

const badgeIcons = {
  steps: Target,
  bolt: Zap,
  code: Code2,
  rocket: Rocket,
} as const;

interface SimulationHeaderProps {
  tag: string;
  title: string;
  description: string;
  compact?: boolean;
  badges?: SimulationBadgeData[];
  useMissionGradient?: boolean;
}

export function SimulationHeader({
  tag,
  title,
  description,
  compact = false,
  badges = [],
  useMissionGradient = false,
}: SimulationHeaderProps) {
  return (
    <Card
      className="overflow-hidden rounded-[28px] border-0"
      style={{
        background: useMissionGradient
          ? simulationTheme.missionGradient
          : simulationTheme.gradient,
        color: "#FFFFFF",
      }}
    >
      <CardContent className={compact ? "px-6 py-6 sm:px-8" : "px-6 py-7 sm:px-8"}>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <Badge
              className="mb-4 rounded-full border-0 px-3 py-1 text-[11px] font-extrabold tracking-[0.18em]"
              style={{ background: "rgba(255,255,255,0.14)", color: "#FFFFFF" }}
            >
              <Play size={12} fill="#FFFFFF" />
              {tag}
            </Badge>
            <h1
              className={compact ? "text-3xl sm:text-4xl" : "text-2xl sm:text-4xl"}
              style={{
                color: "#FFFFFF",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <p
              className="mt-3 max-w-2xl text-sm sm:text-base"
              style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.8 }}
            >
              {description}
            </p>
          </div>

          {badges.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:min-w-[260px]">
              {badges.map((badge) => {
                const Icon = badgeIcons[badge.icon];

                return (
                  <div
                    key={badge.label}
                    className="rounded-2xl px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Icon size={16} />
                    <p className="mt-2 text-sm" style={{ fontWeight: 700 }}>
                      {badge.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
