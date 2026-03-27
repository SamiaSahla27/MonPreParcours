import React from "react";
import {
  X,
  Building2,
  MapPin,
  ExternalLink,
  Mail,
  Award,
  CheckCircle2,
  Calendar,
  TrendingUp,
  FileText,
} from "lucide-react";
import type { EngagedCompany } from "../data/engagedCompaniesData";

interface CompanyDetailModalProps {
  company: EngagedCompany;
  onClose: () => void;
}

export function CompanyDetailModal({ company, onClose }: CompanyDetailModalProps) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
          style={{
            background: "white",
            borderBottom: "1.5px solid rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "48px",
                height: "48px",
                background: company.logoGradient,
                color: "white",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              {company.logoInitials}
            </div>
            <div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#1a1035",
                }}
              >
                {company.name}
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                {company.sector}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <X size={24} style={{ color: "#6B7280" }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Verification badge */}
          {company.verificationStatus === "verified" && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1.5px solid rgba(34,197,94,0.2)",
              }}
            >
              <CheckCircle2 size={20} style={{ color: "#22C55E" }} />
              <div>
                <p
                  className="text-sm"
                  style={{ color: "#22C55E", fontWeight: 700 }}
                >
                  Dossier vérifié
                </p>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Engagements documentés et justificatifs examinés
                </p>
              </div>
            </div>
          )}

          {/* Score */}
          {company.inclusionScore !== undefined && (
            <div
              className="p-4 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #FFF1F2, #FFF7ED)",
                border: "1.5px solid rgba(244,63,94,0.1)",
              }}
            >
              <div className="flex items-center gap-3">
                <TrendingUp size={24} style={{ color: "#F43F5E" }} />
                <div>
                  <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
                    Score Diversité & Inclusion
                  </p>
                  <p
                    style={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "#F43F5E",
                    }}
                  >
                    {company.inclusionScore}/100
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3
              className="text-lg mb-3"
              style={{ fontWeight: 700, color: "#1a1035" }}
            >
              Informations générales
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin size={18} style={{ color: "#9CA3AF" }} className="mt-0.5" />
                <div>
                  <p className="text-sm" style={{ color: "#1a1035", fontWeight: 600 }}>
                    {company.city}, {company.country}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {company.size}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 size={18} style={{ color: "#9CA3AF" }} className="mt-0.5" />
                <p className="text-sm" style={{ color: "#4B5563" }}>
                  {company.description}
                </p>
              </div>
            </div>
          </div>

          {/* Commitments */}
          <div>
            <h3
              className="text-lg mb-3"
              style={{ fontWeight: 700, color: "#1a1035" }}
            >
              Engagements déclarés
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.commitments.map((commitment, idx) => (
                <span
                  key={idx}
                  className="px-3 py-2 rounded-xl text-sm"
                  style={{
                    background: "rgba(244,63,94,0.1)",
                    color: "#F43F5E",
                    fontWeight: 600,
                    border: "1.5px solid rgba(244,63,94,0.2)",
                  }}
                >
                  {commitment}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3
              className="text-lg mb-3"
              style={{ fontWeight: 700, color: "#1a1035" }}
            >
              Actions concrètes mises en place
            </h3>
            <div className="space-y-3">
              {company.actions.map((action) => (
                <div
                  key={action.id}
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(0,0,0,0.02)",
                    border: "1.5px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="px-2 py-1 rounded-lg text-xs flex-shrink-0"
                      style={{
                        background: "rgba(244,63,94,0.1)",
                        color: "#F43F5E",
                        fontWeight: 600,
                      }}
                    >
                      {action.category}
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-sm mb-1"
                        style={{ fontWeight: 700, color: "#1a1035" }}
                      >
                        {action.title}
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: "#4B5563", lineHeight: 1.6 }}
                      >
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Labels */}
          {company.labels.length > 0 && (
            <div>
              <h3
                className="text-lg mb-3"
                style={{ fontWeight: 700, color: "#1a1035" }}
              >
                Labels & Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {company.labels.map((label) => (
                  <div
                    key={label.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      border: "1.5px solid rgba(245,158,11,0.2)",
                    }}
                  >
                    <Award size={20} style={{ color: "#F59E0B" }} />
                    <div>
                      <p
                        className="text-sm"
                        style={{ fontWeight: 700, color: "#1a1035" }}
                      >
                        {label.name}
                      </p>
                      <p className="text-xs" style={{ color: "#6B7280" }}>
                        {label.issuer} • {label.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidences */}
          {company.evidences.length > 0 && (
            <div>
              <h3
                className="text-lg mb-3"
                style={{ fontWeight: 700, color: "#1a1035" }}
              >
                Preuves & Justificatifs
              </h3>
              <div className="space-y-2">
                {company.evidences.map((evidence) => (
                  <a
                    key={evidence.id}
                    href={evidence.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-gray-50"
                    style={{
                      border: "1.5px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} style={{ color: "#9CA3AF" }} />
                      <div>
                        <p
                          className="text-sm"
                          style={{ fontWeight: 600, color: "#1a1035" }}
                        >
                          {evidence.title}
                        </p>
                        <p className="text-xs" style={{ color: "#6B7280" }}>
                          {evidence.type}
                        </p>
                      </div>
                    </div>
                    <ExternalLink size={16} style={{ color: "#9CA3AF" }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Transparency note */}
          <div
            className="p-4 rounded-xl"
            style={{
              background: "rgba(59,130,246,0.05)",
              border: "1.5px solid rgba(59,130,246,0.1)",
            }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} style={{ color: "#3B82F6" }} className="mt-0.5" />
              <div>
                <p
                  className="text-sm mb-1"
                  style={{ fontWeight: 700, color: "#1a1035" }}
                >
                  Note de transparence
                </p>
                <p className="text-xs mb-2" style={{ color: "#6B7280", lineHeight: 1.6 }}>
                  Cette entreprise a soumis son dossier d'engagement et fourni des
                  justificatifs qui ont été examinés par notre équipe. Les
                  informations affichées reflètent les éléments communiqués et
                  vérifiés à la date de dernière mise à jour.
                </p>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
                  <Calendar size={12} />
                  <span>
                    Dernière vérification :{" "}
                    {new Date(company.lastReviewedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all duration-200 hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                color: "white",
                fontWeight: 700,
              }}
            >
              <ExternalLink size={16} />
              Visiter le site web
            </a>

            {company.careersUrl && (
              <a
                href={company.careersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all duration-200 hover:bg-gray-50"
                style={{
                  border: "1.5px solid rgba(244,63,94,0.3)",
                  color: "#F43F5E",
                  fontWeight: 700,
                }}
              >
                <Building2 size={16} />
                Page Carrières
              </a>
            )}

            {company.publicContactEmail && (
              <a
                href={`mailto:${company.publicContactEmail}`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all duration-200 hover:bg-gray-50"
                style={{
                  border: "1.5px solid rgba(244,63,94,0.3)",
                  color: "#F43F5E",
                  fontWeight: 700,
                }}
              >
                <Mail size={16} />
                Contacter
              </a>
            )}
          </div>

          {company.publicContactName && (
            <div className="text-center text-xs" style={{ color: "#6B7280" }}>
              Contact : {company.publicContactName}
              {company.publicContactRole && ` • ${company.publicContactRole}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
