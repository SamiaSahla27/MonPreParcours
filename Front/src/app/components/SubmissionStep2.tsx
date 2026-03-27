import React from "react";
import { CompanySubmission, COMMITMENT_TYPES } from "../data/companySubmission";
import { Check } from "lucide-react";

interface Props {
  submission: CompanySubmission;
  updateSubmission: (updates: Partial<CompanySubmission>) => void;
}

export function Step2Commitments({ submission, updateSubmission }: Props) {
  const handleCommitmentToggle = (id: string) => {
    const updatedCommitments = submission.commitments.map((c) =>
      c.id === id ? { ...c, selected: !c.selected } : c
    );
    updateSubmission({ commitments: updatedCommitments });
  };

  const handleCommitmentDescription = (id: string, description: string) => {
    const updatedCommitments = submission.commitments.map((c) =>
      c.id === id ? { ...c, description } : c
    );
    updateSubmission({ commitments: updatedCommitments });
  };

  const selectedCount = submission.commitments.filter((c) => c.selected).length;

  return (
    <div className="space-y-6">
      <div>
        <h3
          className="mb-1"
          style={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#1a1035",
          }}
        >
          Engagements déclarés
        </h3>
        <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
          Sélectionnez au minimum 2 engagements et décrivez les actions concrètes mises en place
        </p>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{
            background: selectedCount >= 2 ? "#ECFDF5" : "#FEF2F2",
            color: selectedCount >= 2 ? "#10B981" : "#F43F5E",
            fontWeight: 700,
            border: `1.5px solid ${selectedCount >= 2 ? "#A7F3D0" : "#FCA5A5"}`,
          }}
        >
          {selectedCount} engagement{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}
          {selectedCount >= 2 && <Check size={14} />}
        </div>
      </div>

      <div className="space-y-4">
        {COMMITMENT_TYPES.map((commitmentType) => {
          const commitment = submission.commitments.find((c) => c.id === commitmentType.id);
          const isSelected = commitment?.selected || false;

          return (
            <div
              key={commitmentType.id}
              className="rounded-2xl p-4 transition-all duration-200"
              style={{
                background: isSelected ? "#FFF1F2" : "white",
                border: `1.5px solid ${isSelected ? "#F43F5E" : "rgba(0,0,0,0.1)"}`,
              }}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCommitmentToggle(commitmentType.id)}
                  className="mt-1 w-5 h-5 rounded-lg cursor-pointer"
                  style={{
                    accentColor: "#F43F5E",
                  }}
                />
                <div className="flex-1">
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: "#1a1035" }}
                  >
                    {commitmentType.label}
                  </p>
                  {isSelected && (
                    <textarea
                      value={commitment?.description || ""}
                      onChange={(e) =>
                        handleCommitmentDescription(commitmentType.id, e.target.value)
                      }
                      rows={3}
                      className="w-full mt-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
                      style={{
                        border: "1.5px solid rgba(244,63,94,0.2)",
                        background: "white",
                        color: "#1F2937",
                      }}
                      placeholder={commitmentType.placeholder}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
