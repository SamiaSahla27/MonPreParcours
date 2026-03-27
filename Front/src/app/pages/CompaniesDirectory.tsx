import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Search,
  Building2,
  MapPin,
  Award,
  ExternalLink,
  Mail,
  Filter,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import {
  ENGAGED_COMPANIES,
  COMPANY_SECTORS,
  COMPANY_SIZES,
  COMMITMENT_TYPES,
  SORT_OPTIONS,
  type EngagedCompany,
} from "../data/engagedCompaniesData";
import { CompanyDetailModal } from "../components/CompanyDetailModal";

export function CompaniesDirectory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("Tous les secteurs");
  const [selectedSize, setSelectedSize] = useState("Toutes les tailles");
  const [selectedCommitment, setSelectedCommitment] = useState("Tous les engagements");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState("score-desc");
  const [selectedCompany, setSelectedCompany] = useState<EngagedCompany | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let filtered = [...ENGAGED_COMPANIES];

    // Search by name
    if (searchQuery.trim()) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by sector
    if (selectedSector !== "Tous les secteurs") {
      filtered = filtered.filter((c) => c.sector === selectedSector);
    }

    // Filter by size
    if (selectedSize !== "Toutes les tailles") {
      filtered = filtered.filter((c) => c.size === selectedSize);
    }

    // Filter by commitment
    if (selectedCommitment !== "Tous les engagements") {
      filtered = filtered.filter((c) =>
        c.commitments.some((commitment) =>
          commitment.toLowerCase().includes(selectedCommitment.toLowerCase())
        )
      );
    }

    // Filter by verification status
    if (onlyVerified) {
      filtered = filtered.filter((c) => c.verificationStatus === "verified");
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return (b.inclusionScore || 0) - (a.inclusionScore || 0);
        case "score-asc":
          return (a.inclusionScore || 0) - (b.inclusionScore || 0);
        case "recent":
          return (
            new Date(b.lastReviewedAt).getTime() -
            new Date(a.lastReviewedAt).getTime()
          );
        case "alpha":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    searchQuery,
    selectedSector,
    selectedSize,
    selectedCommitment,
    onlyVerified,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSector("Tous les secteurs");
    setSelectedSize("Toutes les tailles");
    setSelectedCommitment("Tous les engagements");
    setOnlyVerified(false);
    setSortBy("score-desc");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedSector !== "Tous les secteurs" ||
    selectedSize !== "Toutes les tailles" ||
    selectedCommitment !== "Tous les engagements" ||
    onlyVerified;

  return (
    <div
      className="min-h-screen pb-16"
      style={{
        background: "#F8F7FF",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FFF1F2 0%, #FFF7ED 50%, #F5F3FF 100%)",
          borderBottom: "1.5px solid rgba(244,63,94,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back button */}
          <button
            onClick={() => navigate("/engaged-companies")}
            className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl text-sm transition-all duration-200 hover:bg-white/50"
            style={{
              border: "1.5px solid rgba(244,63,94,0.2)",
              color: "#F43F5E",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} />
            Retour
          </button>

          {/* Hero content */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(244,63,94,0.15)",
                border: "1.5px solid rgba(244,63,94,0.25)",
              }}
            >
              <Building2 size={14} style={{ color: "#F43F5E" }} />
              <span
                className="text-xs"
                style={{
                  color: "#F43F5E",
                  fontWeight: 700,
                }}
              >
                Annuaire
              </span>
            </div>

            <h1
              style={{
                fontWeight: 800,
                fontSize: "2.5rem",
                color: "#1a1035",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "1rem",
              }}
            >
              Explorer les entreprises engagées
            </h1>

            <p
              className="text-base mb-4"
              style={{
                color: "#4B5563",
                lineHeight: 1.7,
                maxWidth: "700px",
              }}
            >
              Découvrez des entreprises ayant soumis des engagements et
              justificatifs liés à l'inclusion, la diversité et l'égalité
              professionnelle. Tous les profils affichés ont fourni des éléments
              concrets examinés avant leur référencement.
            </p>

            <div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1.5px solid rgba(59,130,246,0.2)",
                color: "#2563EB",
              }}
            >
              <CheckCircle2 size={14} />
              <span style={{ fontWeight: 600 }}>
                Les entreprises affichées ici ont fourni des preuves vérifiées
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Bar */}
        <div className="mb-6">
          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <Search
                size={20}
                style={{ color: "#9CA3AF" }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Rechercher une entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  background: "white",
                  color: "#1a1035",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              />
            </div>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 mb-4 w-full justify-center"
            style={{
              border: "1.5px solid rgba(244,63,94,0.2)",
              color: "#F43F5E",
              fontWeight: 600,
              background: showFilters ? "rgba(244,63,94,0.05)" : "white",
            }}
          >
            <Filter size={16} />
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </button>

          {/* Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:grid lg:grid-cols-4 gap-3`}
          >
            {/* Sector filter */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 w-full mb-3 lg:mb-0"
              style={{
                border: "1.5px solid rgba(0,0,0,0.1)",
                background: "white",
                color: "#1a1035",
                fontWeight: 500,
              }}
            >
              {COMPANY_SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>

            {/* Size filter */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 w-full mb-3 lg:mb-0"
              style={{
                border: "1.5px solid rgba(0,0,0,0.1)",
                background: "white",
                color: "#1a1035",
                fontWeight: 500,
              }}
            >
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            {/* Commitment filter */}
            <select
              value={selectedCommitment}
              onChange={(e) => setSelectedCommitment(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 w-full mb-3 lg:mb-0"
              style={{
                border: "1.5px solid rgba(0,0,0,0.1)",
                background: "white",
                color: "#1a1035",
                fontWeight: 500,
              }}
            >
              {COMMITMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 w-full"
              style={{
                border: "1.5px solid rgba(0,0,0,0.1)",
                background: "white",
                color: "#1a1035",
                fontWeight: 500,
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Verified only toggle */}
          <div className="flex items-center gap-3 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: "#F43F5E" }}
              />
              <span
                className="text-sm"
                style={{ color: "#4B5563", fontWeight: 500 }}
              >
                Uniquement entreprises vérifiées
              </span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  color: "#F43F5E",
                  fontWeight: 600,
                  background: "rgba(244,63,94,0.1)",
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm" style={{ color: "#6B7280", fontWeight: 500 }}>
            <span style={{ color: "#1a1035", fontWeight: 700 }}>
              {filteredCompanies.length}
            </span>{" "}
            {filteredCompanies.length === 1
              ? "entreprise trouvée"
              : "entreprises trouvées"}
          </p>
        </div>

        {/* Empty state */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-16">
            <Building2
              size={48}
              style={{ color: "#D1D5DB", margin: "0 auto 16px" }}
            />
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#1a1035",
                marginBottom: "8px",
              }}
            >
              Aucune entreprise trouvée
            </h3>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>
              Essayez d'ajuster vos filtres ou votre recherche
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-sm transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                color: "white",
                fontWeight: 600,
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((company) => (
            <CompanyDirectoryCard
              key={company.id}
              company={company}
              onClick={() => setSelectedCompany(company)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}

// Company Card Component
interface CompanyDirectoryCardProps {
  company: EngagedCompany;
  onClick: () => void;
}

function CompanyDirectoryCard({ company, onClick }: CompanyDirectoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-5 transition-all duration-300 cursor-pointer hover:shadow-lg"
      style={{
        background: "white",
        border: "1.5px solid rgba(0,0,0,0.08)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
      }}
    >
      {/* Company Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
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

        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-base mb-1 truncate"
            style={{ color: "#1a1035" }}
          >
            {company.name}
          </h3>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            {company.sector}
          </p>
        </div>

        {/* Verification badge */}
        {company.verificationStatus === "verified" && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <CheckCircle2 size={12} style={{ color: "#22C55E" }} />
            <span
              className="text-xs"
              style={{ color: "#22C55E", fontWeight: 600 }}
            >
              Vérifié
            </span>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} style={{ color: "#9CA3AF" }} />
        <span className="text-xs" style={{ color: "#6B7280" }}>
          {company.city}, {company.country}
        </span>
        <span className="text-xs" style={{ color: "#D1D5DB" }}>•</span>
        <span className="text-xs" style={{ color: "#6B7280" }}>
          {company.size}
        </span>
      </div>

      {/* Description */}
      <p
        className="text-sm mb-4 line-clamp-3"
        style={{ color: "#4B5563", lineHeight: 1.6 }}
      >
        {company.description}
      </p>

      {/* Score */}
      {company.inclusionScore !== undefined && (
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: "#F43F5E" }} />
          <span
            className="text-sm"
            style={{ color: "#1a1035", fontWeight: 600 }}
          >
            Score inclusion : {company.inclusionScore}/100
          </span>
        </div>
      )}

      {/* Commitments badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {company.commitments.slice(0, 3).map((commitment, idx) => (
          <span
            key={idx}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(244,63,94,0.1)",
              color: "#F43F5E",
              fontWeight: 500,
            }}
          >
            {commitment}
          </span>
        ))}
        {company.commitments.length > 3 && (
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(0,0,0,0.05)",
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            +{company.commitments.length - 3}
          </span>
        )}
      </div>

      {/* Labels */}
      {company.labels.length > 0 && (
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
          <Award size={14} style={{ color: "#F59E0B" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            {company.labels.length}{" "}
            {company.labels.length === 1 ? "label" : "labels"}
          </span>
        </div>
      )}

      {/* Actions preview */}
      <div className="space-y-2 mb-4">
        {company.actions.slice(0, 2).map((action) => (
          <div
            key={action.id}
            className="text-xs p-2 rounded-lg"
            style={{
              background: "rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                color: "#1a1035",
                fontWeight: 600,
                marginBottom: "2px",
              }}
            >
              {action.title}
            </p>
            <p
              className="line-clamp-2"
              style={{ color: "#6B7280", lineHeight: 1.4 }}
            >
              {action.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full py-2.5 rounded-xl text-sm transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #F43F5E, #E11D48)",
          color: "white",
          fontWeight: 600,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        Voir le profil complet
      </button>
    </div>
  );
}
