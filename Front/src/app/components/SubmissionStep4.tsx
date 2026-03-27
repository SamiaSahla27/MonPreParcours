import React from "react";
import { CompanySubmission } from "../data/companySubmission";
import { Check } from "lucide-react";

interface Props {
  submission: CompanySubmission;
  updateSubmission: (updates: Partial<CompanySubmission>) => void;
}

export function Step4Review({ submission, updateSubmission }: Props) {
  const selectedCommitments = submission.commitments.filter((c) => c.selected);

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
          Relecture et validation
        </h3>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Vérifiez les informations avant soumission
        </p>
      </div>

      {/* Company Info Summary */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "white",
          border: "1.5px solid rgba(0,0,0,0.1)",
        }}
      >
        <h4 className="text-sm font-semibold mb-3" style={{ color: "#1a1035" }}>
          Informations entreprise
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-32 text-gray-500">Nom :</span>
            <span className="font-semibold">{submission.companyName}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-500">Site web :</span>
            <span className="text-blue-600 truncate">{submission.website}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-500">Secteur :</span>
            <span>{submission.industry}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-500">Taille :</span>
            <span>{submission.size}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-500">Localisation :</span>
            <span>{submission.city}, {submission.country}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-500">Contact :</span>
            <span>{submission.contactName} ({submission.contactRole})</span>
          </div>
        </div>
      </div>

      {/* Commitments Summary */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "white",
          border: "1.5px solid rgba(0,0,0,0.1)",
        }}
      >
        <h4 className="text-sm font-semibold mb-3" style={{ color: "#1a1035" }}>
          Engagements déclarés ({selectedCommitments.length})
        </h4>
        <div className="space-y-2">
          {selectedCommitments.map((commitment) => (
            <div
              key={commitment.id}
              className="flex items-start gap-2 text-sm"
            >
              <Check size={16} style={{ color: "#10B981", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p className="font-semibold" style={{ color: "#1a1035" }}>
                  {commitment.type}
                </p>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  {commitment.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidences Summary */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "white",
          border: "1.5px solid rgba(0,0,0,0.1)",
        }}
      >
        <h4 className="text-sm font-semibold mb-3" style={{ color: "#1a1035" }}>
          Preuves fournies ({submission.evidences.length})
        </h4>
        <div className="space-y-2">
          {submission.evidences.map((evidence) => (
            <div
              key={evidence.id}
              className="flex items-start gap-2 text-sm"
            >
              <Check size={16} style={{ color: "#10B981", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <p className="font-semibold" style={{ color: "#1a1035" }}>
                  {evidence.title}
                </p>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  {evidence.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sworn Statement */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "#FFF7ED",
          border: "1.5px solid #FDBA74",
        }}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={submission.swornStatementAccepted}
            onChange={(e) =>
              updateSubmission({ swornStatementAccepted: e.target.checked })
            }
            className="mt-1 w-5 h-5 rounded-lg cursor-pointer"
            style={{
              accentColor: "#F43F5E",
            }}
          />
          <div className="flex-1">
            <p className="text-sm font-semibold mb-2" style={{ color: "#1a1035" }}>
              Attestation sur l'honneur <span style={{ color: "#F43F5E" }}>*</span>
            </p>
            <p className="text-xs" style={{ color: "#6B7280", lineHeight: 1.6 }}>
              J'atteste que les informations transmises sont exactes et que les documents 
              fournis peuvent être utilisés pour l'étude de mon dossier.
            </p>
          </div>
        </label>
      </div>

      {/* Transparency Note */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "#F0F9FF",
          border: "1.5px solid #BAE6FD",
        }}
      >
        <p className="text-xs" style={{ color: "#075985", lineHeight: 1.7 }}>
          <strong>Note de transparence :</strong> Le référencement repose sur des éléments 
          fournis par l'entreprise et sur une vérification du dossier. Il ne constitue pas 
          une certification absolue, mais une validation de preuves concrètes et consultables.
        </p>
      </div>
    </div>
  );
}
