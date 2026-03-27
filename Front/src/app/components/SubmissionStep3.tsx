import React, { useState } from "react";
import { CompanySubmission, Evidence, EvidenceType } from "../data/companySubmission";
import { Plus, X, FileText, Link as LinkIcon, AlertCircle } from "lucide-react";

interface Props {
  submission: CompanySubmission;
  updateSubmission: (updates: Partial<CompanySubmission>) => void;
}

export function Step3Evidences({ submission, updateSubmission }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvidence, setNewEvidence] = useState<Partial<Evidence>>({
    id: "",
    type: EvidenceType.PUBLIC_URL,
    title: "",
    description: "",
    year: "",
    externalUrl: "",
  });

  const handleAddEvidence = () => {
    if (!newEvidence.title || !newEvidence.description) return;
    if (!newEvidence.externalUrl && !newEvidence.file) {
      alert("Vous devez fournir soit un fichier, soit une URL");
      return;
    }

    const evidence: Evidence = {
      id: Date.now().toString(),
      type: newEvidence.type as EvidenceType,
      title: newEvidence.title,
      description: newEvidence.description,
      year: newEvidence.year,
      externalUrl: newEvidence.externalUrl,
      file: newEvidence.file,
    };

    updateSubmission({ evidences: [...submission.evidences, evidence] });
    setNewEvidence({
      id: "",
      type: EvidenceType.PUBLIC_URL,
      title: "",
      description: "",
      year: "",
      externalUrl: "",
      file: undefined,
    });
    setShowAddForm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("La taille du fichier ne doit pas dépasser 10 Mo");
        return;
      }
      // Check file type (PDF only for now, can be extended)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert("Format de fichier non accepté. Formats acceptés : PDF, JPG, PNG");
        return;
      }
      setNewEvidence({ ...newEvidence, file });
    }
  };

  const handleRemoveEvidence = (id: string) => {
    updateSubmission({
      evidences: submission.evidences.filter((e) => e.id !== id),
    });
  };

  const evidenceCount = submission.evidences.length;
  const hasPublicLink = submission.evidences.some((e) => e.externalUrl);

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
          Preuves et justificatifs
        </h3>
        <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
          Fournissez au minimum 2 preuves. Chaque preuve doit avoir soit un lien public, soit un fichier uploadé.
        </p>

        {/* Info box */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{
            background: "#F0F9FF",
            border: "1.5px solid #BAE6FD",
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} style={{ color: "#0EA5E9", flexShrink: 0 }} />
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: "#0369A1" }}>
                Qu'est-ce qu'une preuve recevable ?
              </p>
              <p className="text-xs" style={{ color: "#075985", lineHeight: 1.6 }}>
                Une preuve recevable est un élément concret, daté et vérifiable montrant qu'une 
                action, une politique ou un engagement existe réellement dans l'entreprise.
              </p>
              <p className="text-xs mt-2" style={{ color: "#075985", lineHeight: 1.6 }}>
                <strong>Exemples :</strong> charte diversité, index égalité, politique handicap, 
                guide recrutement inclusif, rapport RSE, certification, page officielle, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-wrap gap-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              background: evidenceCount >= 2 ? "#ECFDF5" : "#FEF2F2",
              color: evidenceCount >= 2 ? "#10B981" : "#F43F5E",
              fontWeight: 700,
              border: `1.5px solid ${evidenceCount >= 2 ? "#A7F3D0" : "#FCA5A5"}`,
            }}
          >
            {evidenceCount} preuve{evidenceCount > 1 ? "s" : ""} ajoutée{evidenceCount > 1 ? "s" : ""}
          </div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              background: hasPublicLink ? "#ECFDF5" : "#FEF2F2",
              color: hasPublicLink ? "#10B981" : "#F43F5E",
              fontWeight: 700,
              border: `1.5px solid ${hasPublicLink ? "#A7F3D0" : "#FCA5A5"}`,
            }}
          >
            {hasPublicLink ? "✓" : "✗"} Preuve vérifiable (URL ou fichier)
          </div>
        </div>
      </div>

      {/* Evidence list */}
      {submission.evidences.length > 0 && (
        <div className="space-y-3">
          {submission.evidences.map((evidence) => (
            <div
              key={evidence.id}
              className="rounded-2xl p-4"
              style={{
                background: "white",
                border: "1.5px solid rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {evidence.externalUrl ? (
                      <LinkIcon size={16} style={{ color: "#0EA5E9" }} />
                    ) : (
                      <FileText size={16} style={{ color: "#F97316" }} />
                    )}
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "#F0F9FF",
                        color: "#0369A1",
                        fontWeight: 600,
                      }}
                    >
                      {evidence.type}
                    </span>
                    {evidence.year && (
                      <span className="text-xs" style={{ color: "#9CA3AF" }}>
                        {evidence.year}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#1a1035" }}>
                    {evidence.title}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {evidence.description}
                  </p>
                  {evidence.externalUrl && (
                    <a
                      href={evidence.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs mt-2 inline-block hover:underline"
                      style={{ color: "#0EA5E9" }}
                    >
                      {evidence.externalUrl}
                    </a>
                  )}
                  {evidence.file && (
                    <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "#F97316" }}>
                      <FileText size={14} />
                      <span className="font-semibold">{evidence.file.name}</span>
                      <span style={{ color: "#9CA3AF" }}>
                        ({(evidence.file.size / 1024).toFixed(0)} Ko)
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveEvidence(evidence.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-red-50"
                  style={{
                    border: "1.5px solid rgba(244,63,94,0.2)",
                    color: "#F43F5E",
                  }}
                  aria-label="Supprimer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add evidence form */}
      {showAddForm ? (
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#FFF7ED",
            border: "1.5px solid #FDBA74",
          }}
        >
          <h4 className="text-sm font-semibold mb-4" style={{ color: "#1a1035" }}>
            Ajouter une preuve
          </h4>

          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
                Type de preuve <span style={{ color: "#F43F5E" }}>*</span>
              </label>
              <select
                value={newEvidence.type}
                onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value as EvidenceType })}
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                }}
              >
                {Object.values(EvidenceType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
                Titre <span style={{ color: "#F43F5E" }}>*</span>
              </label>
              <input
                type="text"
                value={newEvidence.title}
                onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                }}
                placeholder="Ex: Index égalité professionnelle 2024"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
                Description <span style={{ color: "#F43F5E" }}>*</span>
              </label>
              <textarea
                value={newEvidence.description}
                onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-xl text-sm resize-none"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                }}
                placeholder="Décrivez brièvement ce document ou cette preuve"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
                Année (optionnel)
              </label>
              <input
                type="text"
                value={newEvidence.year}
                onChange={(e) => setNewEvidence({ ...newEvidence, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                }}
                placeholder="2024"
              />
            </div>

            {/* URL or File */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#374151" }}>
                Lien URL ou fichier <span style={{ color: "#F43F5E" }}>*</span>
              </label>
              <p className="text-xs mb-2" style={{ color: "#6B7280" }}>
                Fournissez soit un lien public, soit uploadez un fichier (PDF, JPG, PNG - max 10 Mo)
              </p>
              
              {/* URL Input */}
              <input
                type="url"
                value={newEvidence.externalUrl}
                onChange={(e) => setNewEvidence({ ...newEvidence, externalUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-sm mb-2"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                }}
                placeholder="https://... (optionnel si fichier fourni)"
              />

              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  id="evidence-file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="evidence-file"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200 hover:bg-gray-50"
                  style={{
                    border: "1.5px dashed rgba(0,0,0,0.2)",
                    color: "#6B7280",
                  }}
                >
                  <FileText size={16} />
                  {newEvidence.file ? newEvidence.file.name : "Choisir un fichier (optionnel si URL fournie)"}
                </label>
              </div>

              {newEvidence.file && (
                <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: "#10B981" }}>
                  <FileText size={14} />
                  <span className="font-semibold">{newEvidence.file.name}</span>
                  <span className="text-gray-500">
                    ({(newEvidence.file.size / 1024).toFixed(0)} Ko)
                  </span>
                  <button
                    onClick={() => setNewEvidence({ ...newEvidence, file: undefined })}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddEvidence}
                className="flex-1 px-4 py-2 rounded-xl text-sm transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-sm transition-all duration-200"
                style={{
                  background: "white",
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  color: "#4B5563",
                  fontWeight: 600,
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm transition-all duration-200"
          style={{
            background: "white",
            border: "1.5px dashed rgba(244,63,94,0.3)",
            color: "#F43F5E",
            fontWeight: 700,
          }}
        >
          <Plus size={18} />
          Ajouter une preuve
        </button>
      )}
    </div>
  );
}
