import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Search,
  X,
  ChevronDown,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import {
  MOCK_RESULTS,
  SECTORS,
  RESULT_TYPES,
  SORT_OPTIONS,
  ResultType,
  SearchResult,
} from "../data/searchData";
import { CareerCard } from "../components/search/CareerCard";
import { SimulatorCard } from "../components/search/SimulatorCard";
import { ProfessionalCard } from "../components/search/ProfessionalCard";
import { CompanyCard } from "../components/search/CompanyCard";
import { ResourceCard } from "../components/search/ResourceCard";
import { AIAssistantStrip } from "../components/search/AIAssistantStrip";
import { EmptyState } from "../components/search/EmptyState";
import { SkeletonCard } from "../components/search/SkeletonCard";

const ITEMS_PER_PAGE = 6;

function ResultCardRenderer({
  result,
  featured,
}: {
  result: SearchResult;
  featured?: boolean;
}) {
  switch (result.type) {
    case "career":
      return <CareerCard result={result} featured={featured} />;
    case "simulator":
      return <SimulatorCard result={result} />;
    case "professional":
      return <ProfessionalCard result={result} />;
    case "company":
      return <CompanyCard result={result} />;
    case "resource":
      return <ResourceCard result={result} />;
  }
}

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "designer";

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeType, setActiveType] = useState<ResultType | "all">("all");
  const [activeSector, setActiveSector] = useState("Tous les secteurs");
  const [activeSort, setActiveSort] = useState("Pertinence");
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Simulate loading when query changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      setInputValue(q);
      setCurrentPage(1);
      setSearchParams({ q });
    },
    [setSearchParams]
  );

  // Filter results
  const filteredResults = MOCK_RESULTS.filter((r) => {
    if (activeType !== "all" && r.type !== activeType) return false;
    return true;
  });

  const featuredResult = filteredResults[0];
  const restResults = filteredResults.slice(1);

  const totalPages = Math.ceil(restResults.length / ITEMS_PER_PAGE);
  const paginatedResults = restResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    activeType !== "all" || activeSector !== "Tous les secteurs";

  const resetFilters = () => {
    setActiveType("all");
    setActiveSector("Tous les secteurs");
    setCurrentPage(1);
  };

  const isEmpty = !loading && filteredResults.length === 0;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F8F7FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Search Header */}
      <div
        className="sticky top-16 z-40 border-b"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(124,58,237,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Back + search bar row */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate("/")}
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-violet-50"
              style={{ border: "1.5px solid rgba(124,58,237,0.2)" }}
            >
              <ArrowLeft size={16} style={{ color: "#7C3AED" }} />
            </button>

            {/* Search input */}
            <div
              className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200"
              style={{
                background: "#F5F3FF",
                borderColor: "rgba(124,58,237,0.25)",
                boxShadow: "0 0 0 3px rgba(124,58,237,0.08)",
              }}
            >
              <Search size={16} style={{ color: "#A78BFA", flexShrink: 0 }} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    handleSearch(inputValue.trim());
                  }
                }}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                placeholder="Rechercher un métier, secteur, compétence..."
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue("");
                    handleSearch("");
                  }}
                  className="flex-shrink-0"
                >
                  <X size={14} style={{ color: "#9CA3AF" }} />
                </button>
              )}
              <button
                onClick={() => inputValue.trim() && handleSearch(inputValue.trim())}
                className="flex-shrink-0 px-3 py-1 rounded-lg text-xs transition-colors"
                style={{
                  background: "#7C3AED",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                Chercher
              </button>
            </div>
          </div>

          {/* Results count */}
          <p
            className="text-sm mb-3"
            style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span style={{ color: "#1a1035", fontWeight: 700 }}>
              {filteredResults.length}
            </span>{" "}
            résultats pour{" "}
            <span
              style={{
                color: "#7C3AED",
                fontWeight: 700,
                background: "#EDE9FE",
                padding: "0 6px",
                borderRadius: 6,
              }}
            >
              « {query} »
            </span>
          </p>

          {/* Filters bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {RESULT_TYPES.map((rt) => (
                <button
                  key={rt.key}
                  onClick={() => {
                    setActiveType(rt.key);
                    setCurrentPage(1);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: activeType === rt.key ? "#7C3AED" : "white",
                    color: activeType === rt.key ? "white" : "#6B7280",
                    fontWeight: activeType === rt.key ? 700 : 500,
                    border: `1.5px solid ${activeType === rt.key ? "#7C3AED" : "rgba(0,0,0,0.1)"}`,
                    boxShadow:
                      activeType === rt.key
                        ? "0 2px 8px rgba(124,58,237,0.3)"
                        : "none",
                  }}
                >
                  {rt.label}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-gray-200 hidden sm:block mx-1" />

            {/* Sector dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSectorDropdown(!showSectorDropdown);
                  setShowSortDropdown(false);
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background:
                    activeSector !== "Tous les secteurs" ? "#EDE9FE" : "white",
                  color:
                    activeSector !== "Tous les secteurs" ? "#7C3AED" : "#6B7280",
                  fontWeight: activeSector !== "Tous les secteurs" ? 700 : 500,
                  border: `1.5px solid ${activeSector !== "Tous les secteurs" ? "#C4B5FD" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                <SlidersHorizontal size={12} />
                {activeSector === "Tous les secteurs"
                  ? "Secteur"
                  : activeSector}
                <ChevronDown size={11} />
              </button>
              {showSectorDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 rounded-xl border overflow-hidden z-50"
                  style={{
                    background: "white",
                    borderColor: "rgba(124,58,237,0.15)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  }}
                >
                  {SECTORS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setActiveSector(s);
                        setShowSectorDropdown(false);
                        setCurrentPage(1);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-violet-50"
                      style={{
                        color: activeSector === s ? "#7C3AED" : "#374151",
                        fontWeight: activeSector === s ? 700 : 400,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        background: activeSector === s ? "#F5F3FF" : "white",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowSectorDropdown(false);
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: "white",
                  color: "#6B7280",
                  fontWeight: 500,
                  border: "1.5px solid rgba(0,0,0,0.1)",
                }}
              >
                Trier : {activeSort}
                <ChevronDown size={11} />
              </button>
              {showSortDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 w-40 rounded-xl border overflow-hidden z-50"
                  style={{
                    background: "white",
                    borderColor: "rgba(124,58,237,0.15)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  }}
                >
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setActiveSort(s);
                        setShowSortDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-violet-50"
                      style={{
                        color: activeSort === s ? "#7C3AED" : "#374151",
                        fontWeight: activeSort === s ? 700 : 400,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        background: activeSort === s ? "#F5F3FF" : "white",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors hover:bg-red-50 ml-auto"
                style={{
                  color: "#F43F5E",
                  fontWeight: 600,
                  border: "1.5px solid #FECDD3",
                  background: "#FFF1F2",
                }}
              >
                <RotateCcw size={11} />
                Tout effacer
              </button>
            )}

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex items-center gap-1.5 flex-wrap w-full mt-1">
                {activeType !== "all" && (
                  <span
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "#EDE9FE",
                      color: "#7C3AED",
                      fontWeight: 600,
                    }}
                  >
                    {RESULT_TYPES.find((r) => r.key === activeType)?.label}
                    <button onClick={() => setActiveType("all")}>
                      <X size={10} />
                    </button>
                  </span>
                )}
                {activeSector !== "Tous les secteurs" && (
                  <span
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "#EDE9FE",
                      color: "#7C3AED",
                      fontWeight: 600,
                    }}
                  >
                    {activeSector}
                    <button
                      onClick={() => setActiveSector("Tous les secteurs")}
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        onClick={() => {
          setShowSectorDropdown(false);
          setShowSortDropdown(false);
        }}
      >
        {loading ? (
          /* Skeleton */
          <div>
            <div
              className="w-48 h-5 rounded-lg mb-6 animate-pulse"
              style={{ background: "#E9D5FF" }}
            />
            <div className="rounded-2xl overflow-hidden mb-6 animate-pulse" style={{ height: 180, background: "linear-gradient(135deg, #EDE9FE, #E0F2FE)" }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : isEmpty ? (
          <EmptyState
            query={query}
            onSuggestionClick={(s) => handleSearch(s)}
          />
        ) : (
          <>
            {/* AI Strip */}
            <AIAssistantStrip query={query} />

            {/* Featured result */}
            {featuredResult && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: "#9CA3AF", fontWeight: 700 }}
                  >
                    Meilleure correspondance
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(0,0,0,0.06)" }}
                  />
                </div>
                <ResultCardRenderer result={featuredResult} featured />
              </div>
            )}

            {/* Rest of results */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: "#9CA3AF", fontWeight: 700 }}
              >
                Tous les résultats
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(0,0,0,0.06)" }}
              />
              <span
                className="text-xs"
                style={{ color: "#9CA3AF", fontWeight: 500 }}
              >
                {restResults.length} résultats
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {paginatedResults.map((result) => (
                <ResultCardRenderer key={result.id} result={result} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 disabled:opacity-40"
                  style={{
                    background: "white",
                    border: "1.5px solid rgba(0,0,0,0.1)",
                    color: "#4B5563",
                    fontWeight: 600,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <ArrowLeft size={14} />
                  Précédent
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className="w-9 h-9 rounded-xl text-sm transition-all duration-200"
                        style={{
                          background: currentPage === p ? "#7C3AED" : "white",
                          color: currentPage === p ? "white" : "#6B7280",
                          fontWeight: currentPage === p ? 700 : 500,
                          border: `1.5px solid ${currentPage === p ? "#7C3AED" : "rgba(0,0,0,0.1)"}`,
                          boxShadow:
                            currentPage === p
                              ? "0 2px 8px rgba(124,58,237,0.3)"
                              : "none",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 disabled:opacity-40"
                  style={{
                    background: "white",
                    border: "1.5px solid rgba(0,0,0,0.1)",
                    color: "#4B5563",
                    fontWeight: 600,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Suivant
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
