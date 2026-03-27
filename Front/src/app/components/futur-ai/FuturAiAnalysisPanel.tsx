import React from "react";
import type { CareerAiAnalysis, ImpactItem, TaskAutomationStatus } from "../../services/careerAiApi";

type FuturAiAnalysisPanelProps = {
    analysis: CareerAiAnalysis;
    accentColor: string;
    lightColor: string;
    onSelectComparableCareer: (jobTitle: string) => void;
};

function statusStyle(status: TaskAutomationStatus) {
    if (status === "difficilement remplaçable") {
        return { bg: "#ECFDF5", color: "#047857" };
    }
    if (status === "assistée par l’IA") {
        return { bg: "#EFF6FF", color: "#1D4ED8" };
    }
    return { bg: "#FFFBEB", color: "#B45309" };
}

function impactStyle(level: ImpactItem["level"]) {
    if (level === "faible") return { bg: "#ECFDF5", color: "#047857" };
    if (level === "modéré") return { bg: "#EFF6FF", color: "#1D4ED8" };
    return { bg: "#FEF2F2", color: "#B91C1C" };
}

export function FuturAiAnalysisPanel(props: FuturAiAnalysisPanelProps) {
    const { analysis, accentColor, lightColor, onSelectComparableCareer } = props;

    return (
        <div className="mt-5 flex flex-col gap-5">
            <div className="p-4 rounded-xl" style={{ background: "#FAFAFF", border: "1px solid #E5E7EB" }}>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: lightColor, color: accentColor, fontWeight: 700 }}>
                        Score IA: {analysis.aiCompatibilityScore}/100
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#EEF2FF", color: "#4338CA", fontWeight: 600 }}>
                        Impact global: {analysis.transformationImpact}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#ECFEFF", color: "#0E7490", fontWeight: 600 }}>
                        Horizon: {analysis.timeHorizon}
                    </span>
                </div>

                <p className="mt-3 text-sm" style={{ color: "#374151", lineHeight: 1.7 }}>
                    L’IA transforme surtout certaines tâches du métier, mais ne remplace pas automatiquement la fonction globale.
                </p>
            </div>

            <section className="p-4 rounded-xl" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                <h4 className="text-sm" style={{ fontWeight: 700, color: "#1a1035" }}>Décomposition du score IA</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.scoreBreakdown.map((item) => (
                        <div key={item.label} className="rounded-lg p-3" style={{ background: "#FAFAFF", border: "1px solid #EDE9FE" }}>
                            <div className="flex justify-between gap-3 text-sm">
                                <span style={{ fontWeight: 600, color: "#1F2937" }}>{item.label}</span>
                                <span style={{ fontWeight: 700, color: "#111827" }}>{item.value}/100</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full" style={{ background: "#E5E7EB" }}>
                                <div className="h-2 rounded-full" style={{ width: `${item.value}%`, background: accentColor }} />
                            </div>
                            <p className="mt-2 text-xs" style={{ color: "#6B7280" }}>{item.helper}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-4 rounded-xl" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                <h4 className="text-sm" style={{ fontWeight: 700, color: "#1a1035" }}>Analyse par tâches du métier</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.taskAutomation.map((item) => {
                        const style = statusStyle(item.status);
                        return (
                            <div key={item.task} className="rounded-lg p-3" style={{ border: `1px solid ${style.bg}`, background: style.bg }}>
                                <div className="flex flex-wrap items-center gap-2 justify-between">
                                    <p className="text-sm" style={{ fontWeight: 600, color: "#111827" }}>{item.task}</p>
                                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: style.bg, color: style.color, fontWeight: 700 }}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm" style={{ color: "#4B5563", lineHeight: 1.6 }}>{item.details}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="p-4 rounded-xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                <h4 className="text-sm" style={{ fontWeight: 700, color: "#1a1035" }}>IA assistée vs IA remplacée</h4>
                <div className="mt-3 flex flex-col gap-2">
                    {analysis.pedagogyAssistVsReplace.map((item) => (
                        <p key={item} className="text-sm" style={{ color: "#374151", lineHeight: 1.7 }}>• {item}</p>
                    ))}
                </div>
            </section>

            <section className="p-4 rounded-xl" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                <h4 className="text-sm" style={{ fontWeight: 700, color: "#1a1035" }}>Exemples concrets d’usage de l’IA</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.concreteUseCases.map((item) => (
                        <div key={item.title} className="rounded-lg p-3" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                            <p className="text-sm" style={{ fontWeight: 700, color: "#111827" }}>{item.title}</p>
                            <p className="mt-1 text-sm" style={{ color: "#4B5563", lineHeight: 1.6 }}>{item.details}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                    <h4 className="text-sm" style={{ fontWeight: 700, color: "#1a1035" }}>Ce qui reste profondément humain</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {analysis.deeplyHumanCore.map((item) => (
                            <span key={item} className="text-xs px-2.5 py-1.5 rounded-full" style={{ background: "#F3F4F6", color: "#374151", fontWeight: 600 }}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="p-4 rounded-xl" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                    <h4 className="text-sm" style={{ fontWeight: 700, color: "#1a1035" }}>Projection dans le temps</h4>
                    <div className="mt-3 flex flex-col gap-3">
                        {analysis.timeline.map((item, index) => (
                            <div key={item.period} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: accentColor }} />
                                    {index < analysis.timeline.length - 1 ? <div className="w-px h-full" style={{ background: "#D1D5DB" }} /> : null}
                                </div>
                                <div className="pb-3">
                                    <p className="text-sm" style={{ fontWeight: 700, color: "#111827" }}>{item.period}</p>
                                    <p className="text-sm" style={{ color: "#4B5563", lineHeight: 1.6 }}>{item.evolution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="p-4 rounded-xl" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                <h4 className="text-sm" style={{ fontWeight: 700, color: "#1a1035" }}>Impact sur le métier</h4>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.impactIndicators.map((item) => {
                        const style = impactStyle(item.level);
                        return (
                            <div key={item.label} className="rounded-lg p-3" style={{ border: "1px solid #E5E7EB" }}>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm capitalize" style={{ fontWeight: 700, color: "#111827" }}>{item.label}</p>
                                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: style.bg, color: style.color, fontWeight: 700 }}>
                                        {item.level}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm" style={{ color: "#4B5563", lineHeight: 1.6 }}>{item.details}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="p-4 rounded-xl" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                <h4 className="text-sm" style={{ fontWeight: 700, color: "#1a1035" }}>Compétences humaines à développer</h4>
                <div className="mt-3 flex flex-col gap-3">
                    {analysis.skillsToDevelop.map((skill) => (
                        <div key={skill.skill} className="rounded-lg p-3" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                            <div className="flex flex-wrap items-center gap-2 justify-between">
                                <p className="text-sm" style={{ fontWeight: 700, color: "#111827" }}>{skill.skill}</p>
                                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#EEF2FF", color: "#3730A3", fontWeight: 700 }}>
                                    Importance {skill.priority}
                                </span>
                            </div>
                            {skill.concreteExample ? (
                                <p className="mt-1 text-xs" style={{ color: "#6B7280" }}>
                                    Exemple: {skill.concreteExample}
                                </p>
                            ) : null}
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-4 rounded-xl" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                <h4 className="text-sm" style={{ fontWeight: 700, color: "#1a1035" }}>Comparaison avec des métiers proches</h4>
                <div className="mt-3 flex flex-col gap-2">
                    {analysis.comparableCareers.map((career) => (
                        <button
                            key={career.title}
                            type="button"
                            onClick={() => onSelectComparableCareer(career.title)}
                            className="flex items-center justify-between rounded-lg p-2.5 text-left cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-sm"
                            style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                        >
                            <p className="text-sm" style={{ color: "#111827", fontWeight: 600 }}>{career.title}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#EEF2FF", color: "#3730A3", fontWeight: 700 }}>
                                    {career.score}/100
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#F3F4F6", color: "#374151", fontWeight: 700 }}>
                                    {career.impact}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
