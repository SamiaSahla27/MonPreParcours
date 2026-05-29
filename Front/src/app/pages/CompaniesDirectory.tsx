import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Building2,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";
import { cards } from "../data/cards";
import {
  getEngagedCompaniesOverview,
  getEngagedCompany,
  listEngagedCompanies,
  type EngagedCompanyDetail,
  type EngagedCompanyListItem,
  type EngagedCompaniesOverview,
  type EngagementSortKey,
  type EngagementTheme,
} from "../services/engagedCompaniesApi";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

const ALL_SECTORS_LABEL = "Tous les secteurs";

const SCORE_FILTERS = [
  { value: 0, label: "Tous les scores" },
  { value: 80, label: "80+" },
  { value: 90, label: "90+" },
] as const;

const SORT_OPTIONS: ReadonlyArray<{ key: EngagementSortKey; label: string }> = [
  { key: "impact", label: "Impact" },
  { key: "recent", label: "Mise à jour récente" },
  { key: "alphabetical", label: "Alphabétique" },
];

const THEME_OPTIONS: ReadonlyArray<{ key: EngagementTheme; label: string }> = [
  { key: "inclusion", label: "Inclusion" },
  { key: "equity", label: "Équité" },
  { key: "accessibility", label: "Accessibilité" },
  { key: "social-impact", label: "Impact social" },
];

const LABEL_STYLES = {
  rose: { background: "#FFF1F2", color: "#E11D48" },
  violet: { background: "#F5F3FF", color: "#7C3AED" },
  emerald: { background: "#ECFDF5", color: "#059669" },
  sky: { background: "#F0F9FF", color: "#0284C7" },
  amber: { background: "#FFFBEB", color: "#D97706" },
} as const;

const THEME_LABELS: Record<EngagementTheme, string> = {
  inclusion: "Inclusion",
  equity: "Équité",
  accessibility: "Accessibilité",
  "social-impact": "Impact social",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function scoreLabel(score: number) {
  if (score >= 90) return "Très structuré";
  if (score >= 85) return "Crédible";
  return "À creuser";
}

function ScoreMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span style={{ color: "#6B7280", fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontWeight: 800 }}>{value}/100</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "#F3F4F6" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
          }}
        />
      </div>
    </div>
  );
}

function DirectorySkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-[28px] border p-5"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(0,0,0,0.06)",
      }}
    >
      <div className="h-5 w-28 rounded-full" style={{ background: "#F3F4F6" }} />
      <div className="mt-4 h-7 w-40 rounded-xl" style={{ background: "#F3F4F6" }} />
      <div className="mt-2 h-4 w-28 rounded-lg" style={{ background: "#F3F4F6" }} />
      <div className="mt-5 h-20 rounded-2xl" style={{ background: "#F9FAFB" }} />
      <div className="mt-4 h-12 rounded-2xl" style={{ background: "#F9FAFB" }} />
    </div>
  );
}

export function CompaniesDirectory() {
  const navigate = useNavigate();
  const engagementCard = cards.find((card) => card.id === "inclusion") ?? cards[3];

  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState(ALL_SECTORS_LABEL);
  const [theme, setTheme] = useState<EngagementTheme | "all">("all");
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<EngagementSortKey>("impact");
  const [overview, setOverview] = useState<EngagedCompaniesOverview | null>(null);
  const [companies, setCompanies] = useState<EngagedCompanyListItem[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedCompanyDetail, setSelectedCompanyDetail] =
    useState<EngagedCompanyDetail | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [directoryError, setDirectoryError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getEngagedCompaniesOverview()
      .then((data) => {
        if (cancelled) return;
        setOverview(data);
      })
      .catch((reason) => {
        console.error(reason);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setDirectoryLoading(true);
    setDirectoryError(null);

    listEngagedCompanies({ query, sector, theme, minScore, sort })
      .then((items) => {
        if (cancelled) return;
        setCompanies(items);
      })
      .catch((reason) => {
        if (cancelled) return;
        console.error(reason);
        setDirectoryError("ENGAGEMENT_DIRECTORY_LOAD_FAILED");
      })
      .finally(() => {
        if (cancelled) return;
        setDirectoryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [minScore, query, sector, sort, theme]);

  useEffect(() => {
    if (companies.length === 0) {
      setSelectedCompanyId(null);
      setSelectedCompanyDetail(null);
      return;
    }

    setSelectedCompanyId((current) =>
      current && companies.some((company) => company.id === current)
        ? current
        : companies[0].id,
    );
  }, [companies]);

  useEffect(() => {
    if (!selectedCompanyId) {
      setSelectedCompanyDetail(null);
      setDetailError(null);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);
    setDetailError(null);

    getEngagedCompany(selectedCompanyId)
      .then((detail) => {
        if (cancelled) return;
        setSelectedCompanyDetail(detail);
      })
      .catch((reason) => {
        if (cancelled) return;
        console.error(reason);
        setSelectedCompanyDetail(null);
        setDetailError("ENGAGED_COMPANY_DETAIL_LOAD_FAILED");
      })
      .finally(() => {
        if (cancelled) return;
        setDetailLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCompanyId]);

  const availableSectors = useMemo(
    () => [ALL_SECTORS_LABEL, ...(overview?.sectors ?? [])],
    [overview],
  );

  const featuredCompany = companies[0] ?? null;
  const savedCount = savedIds.length;
  const hasActiveFilters =
    Boolean(query) || sector !== ALL_SECTORS_LABEL || theme !== "all" || minScore > 0;

  function submitSearch() {
    setQuery(inputValue.trim());
  }

  function resetFilters() {
    setInputValue("");
    setQuery("");
    setSector(ALL_SECTORS_LABEL);
    setTheme("all");
    setMinScore(0);
    setSort("impact");
  }

  function toggleSave(companyId: string) {
    setSavedIds((current) =>
      current.includes(companyId)
        ? current.filter((id) => id !== companyId)
        : [...current, companyId],
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(244,63,94,0.10), transparent 28%), linear-gradient(180deg, #FFF8FA 0%, #F8FAFC 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <section
          className="relative overflow-hidden rounded-[32px] px-6 py-6 sm:px-8"
          style={{
            background: engagementCard.gradient,
            boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
          }}
        >
          <div
            className="absolute -right-8 -top-8 h-40 w-40 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div
            className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full"
            style={{ background: "rgba(255,255,255,0.10)" }}
          />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_360px] lg:items-end">
            <div className="max-w-3xl">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-opacity hover:opacity-80"
                style={{
                  color: "#FFFFFF",
                  background: "rgba(255,255,255,0.12)",
                  fontWeight: 700,
                }}
              >
                <ArrowLeft size={15} />
                Retour au portail
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className="rounded-full border-0 px-3 py-1 text-[11px] uppercase tracking-[0.18em]"
                  style={{
                    background: "rgba(255,255,255,0.16)",
                    color: "#FFFFFF",
                    fontWeight: 800,
                  }}
                >
                  Engagement
                </Badge>
                <Badge
                  className="rounded-full border-0 px-3 py-1 text-[11px]"
                  style={{
                    background: "rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.88)",
                    fontWeight: 700,
                  }}
                >
                  Données servies par le backend du projet
                </Badge>
              </div>

              <h1
                className="mt-4 text-3xl sm:text-4xl"
                style={{
                  color: "#FFFFFF",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Explorer les entreprises par leurs preuves d'engagement
              </h1>
              <p
                className="mt-3 max-w-2xl text-sm sm:text-base"
                style={{ color: "rgba(255,255,255,0.86)", lineHeight: 1.8 }}
              >
                Ici, on ne classe pas les entreprises sur une promesse marketing.
                On regarde ce qu'elles rendent visible: critères de recrutement,
                initiatives concrètes, indices d'équité et questions utiles à poser.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.14)" }}
                >
                  <div className="text-2xl" style={{ color: "#FFFFFF", fontWeight: 800 }}>
                    {overview?.companyCount ?? "..."}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.82)" }}>
                    entreprises documentées
                  </div>
                </div>
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.14)" }}
                >
                  <div className="text-2xl" style={{ color: "#FFFFFF", fontWeight: 800 }}>
                    {overview?.evidenceEntryCount ?? "..."}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.82)" }}>
                    éléments de preuve listés
                  </div>
                </div>
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.14)" }}
                >
                  <div className="text-2xl" style={{ color: "#FFFFFF", fontWeight: 800 }}>
                    {THEME_OPTIONS.length}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.82)" }}>
                    axes d'analyse
                  </div>
                </div>
              </div>
            </div>

            <Card
              className="rounded-[28px] border-0"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(14px)",
                boxShadow: "none",
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} color="#FFFFFF" />
                  <p style={{ color: "#FFFFFF", fontWeight: 800 }}>Ce que tu peux lire ici</p>
                </div>
                <div className="mt-4 grid gap-3">
                  {[
                    "Des signaux visibles dès le recrutement",
                    "Des initiatives décrites en langage concret",
                    "Des questions utiles à poser avant de postuler",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl px-3 py-3"
                      style={{ background: "rgba(255,255,255,0.10)" }}
                    >
                      <CheckCircle2 size={16} color="#FFFFFF" className="mt-0.5" />
                      <span
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.88)", lineHeight: 1.6 }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-8">
          <Card
            className="rounded-[28px] border"
            style={{
              background: "#FFFFFF",
              borderColor: "rgba(244,63,94,0.10)",
              boxShadow: "0 18px 40px rgba(15,23,42,0.05)",
            }}
          >
            <CardContent className="p-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_220px_220px]">
                <div>
                  <div
                    className="flex items-center gap-2 rounded-2xl border px-4 py-3"
                    style={{
                      background: "#FFF8FA",
                      borderColor: "rgba(244,63,94,0.14)",
                    }}
                  >
                    <Search size={16} style={{ color: engagementCard.accentColor, flexShrink: 0 }} />
                    <Input
                      value={inputValue}
                      onChange={(event) => setInputValue(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") submitSearch();
                      }}
                      placeholder="Nom, signal d'inclusion, accessibilité, parentalité..."
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                    <Button
                      type="button"
                      onClick={submitSearch}
                      className="rounded-xl"
                      style={{
                        background: engagementCard.accentColor,
                        color: "#FFFFFF",
                        boxShadow: "0 12px 24px rgba(244,63,94,0.18)",
                      }}
                    >
                      Rechercher
                    </Button>
                  </div>
                </div>

                <label className="space-y-2 text-sm">
                  <span style={{ color: "#6B7280", fontWeight: 700 }}>Secteur</span>
                  <select
                    value={sector}
                    onChange={(event) => setSector(event.target.value)}
                    className="flex h-10 w-full rounded-xl border px-3 text-sm outline-none"
                    style={{
                      borderColor: "rgba(17,24,39,0.10)",
                      background: "#FFFFFF",
                    }}
                  >
                    {availableSectors.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm">
                  <span style={{ color: "#6B7280", fontWeight: 700 }}>Tri</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as EngagementSortKey)}
                    className="flex h-10 w-full rounded-xl border px-3 text-sm outline-none"
                    style={{
                      borderColor: "rgba(17,24,39,0.10)",
                      background: "#FFFFFF",
                    }}
                  >
                    {SORT_OPTIONS.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} style={{ color: "#9CA3AF" }} />
                  <span className="text-sm" style={{ color: "#6B7280", fontWeight: 700 }}>
                    Axe prioritaire
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTheme("all")}
                  className="rounded-full px-4 py-2 text-sm transition-all duration-200"
                  style={{
                    background: theme === "all" ? "#1F2937" : "#F9FAFB",
                    color: theme === "all" ? "#FFFFFF" : "#4B5563",
                    fontWeight: 700,
                    border: `1px solid ${theme === "all" ? "#1F2937" : "#E5E7EB"}`,
                  }}
                >
                  Tous
                </button>
                {THEME_OPTIONS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTheme(item.key)}
                    className="rounded-full px-4 py-2 text-sm transition-all duration-200"
                    style={{
                      background: theme === item.key ? engagementCard.lightColor : "#FFFFFF",
                      color: theme === item.key ? engagementCard.accentColor : "#4B5563",
                      fontWeight: 700,
                      border: `1px solid ${
                        theme === item.key ? "#FDA4AF" : "#E5E7EB"
                      }`,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-sm" style={{ color: "#6B7280", fontWeight: 700 }}>
                  Score minimum
                </span>
                {SCORE_FILTERS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setMinScore(preset.value)}
                    className="rounded-full px-4 py-2 text-sm transition-all duration-200"
                    style={{
                      background: minScore === preset.value ? "#1F2937" : "#FFFFFF",
                      color: minScore === preset.value ? "#FFFFFF" : "#4B5563",
                      fontWeight: 700,
                      border: `1px solid ${
                        minScore === preset.value ? "#1F2937" : "#E5E7EB"
                      }`,
                    }}
                  >
                    {preset.label}
                  </button>
                ))}

                {hasActiveFilters ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetFilters}
                    className="ml-auto rounded-full"
                    style={{ color: engagementCard.accentColor, fontWeight: 700 }}
                  >
                    Tout effacer
                  </Button>
                ) : null}
              </div>

              {hasActiveFilters ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {query ? (
                    <Badge
                      className="rounded-full border-0 px-3 py-1.5"
                      style={{
                        background: "#FFF1F2",
                        color: engagementCard.accentColor,
                        fontWeight: 700,
                      }}
                    >
                      Recherche: {query}
                    </Badge>
                  ) : null}
                  {sector !== ALL_SECTORS_LABEL ? (
                    <Badge
                      className="rounded-full border-0 px-3 py-1.5"
                      style={{ background: "#F9FAFB", color: "#4B5563", fontWeight: 700 }}
                    >
                      {sector}
                    </Badge>
                  ) : null}
                  {theme !== "all" ? (
                    <Badge
                      className="rounded-full border-0 px-3 py-1.5"
                      style={{ background: "#F5F3FF", color: "#7C3AED", fontWeight: 700 }}
                    >
                      {THEME_LABELS[theme]}
                    </Badge>
                  ) : null}
                  {minScore > 0 ? (
                    <Badge
                      className="rounded-full border-0 px-3 py-1.5"
                      style={{ background: "#ECFDF5", color: "#059669", fontWeight: 700 }}
                    >
                      Score {minScore}+
                    </Badge>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="order-1 lg:sticky lg:top-24 lg:self-start">
            <Card
              className="rounded-[28px] border"
              style={{
                background: "#FFFFFF",
                borderColor: "rgba(244,63,94,0.10)",
                boxShadow: "0 18px 36px rgba(15,23,42,0.05)",
              }}
            >
              <CardContent className="p-6">
                {directoryLoading || (detailLoading && !selectedCompanyDetail) ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-5 w-32 rounded-full" style={{ background: "#F3F4F6" }} />
                    <div className="h-8 w-48 rounded-xl" style={{ background: "#F3F4F6" }} />
                    <div className="h-20 rounded-2xl" style={{ background: "#F9FAFB" }} />
                    <div className="h-24 rounded-2xl" style={{ background: "#F9FAFB" }} />
                    <div className="h-24 rounded-2xl" style={{ background: "#F9FAFB" }} />
                  </div>
                ) : selectedCompanyDetail ? (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge
                          className="rounded-full border-0 px-3 py-1"
                          style={{
                            background: engagementCard.lightColor,
                            color: engagementCard.accentColor,
                            fontWeight: 800,
                          }}
                        >
                          Fiche mise en avant
                        </Badge>
                        <h2
                          className="mt-4 text-2xl"
                          style={{
                            color: "#111827",
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                          }}
                        >
                          {selectedCompanyDetail.name}
                        </h2>
                        <div
                          className="mt-2 flex flex-wrap items-center gap-2 text-sm"
                          style={{ color: "#6B7280", fontWeight: 600 }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Building2 size={14} />
                            {selectedCompanyDetail.sector}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={14} />
                            {selectedCompanyDetail.location}
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant={
                          savedIds.includes(selectedCompanyDetail.id) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleSave(selectedCompanyDetail.id)}
                        className="rounded-full"
                        style={
                          savedIds.includes(selectedCompanyDetail.id)
                            ? {
                                background: engagementCard.accentColor,
                                color: "#FFFFFF",
                              }
                            : undefined
                        }
                      >
                        <Bookmark size={14} />
                        {savedIds.includes(selectedCompanyDetail.id)
                          ? "Shortlistée"
                          : "Shortlister"}
                      </Button>
                    </div>

                    <p className="mt-4 text-sm" style={{ color: "#4B5563", lineHeight: 1.8 }}>
                      {selectedCompanyDetail.pitch}
                    </p>

                    <div
                      className="mt-5 rounded-3xl px-4 py-4"
                      style={{
                        background: "linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)",
                        border: "1px solid rgba(244,63,94,0.12)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div
                            className="text-sm"
                            style={{ color: "#6B7280", fontWeight: 700 }}
                          >
                            Score global
                          </div>
                          <div
                            className="text-3xl"
                            style={{
                              color: engagementCard.accentColor,
                              fontWeight: 800,
                              letterSpacing: "-0.04em",
                            }}
                          >
                            {selectedCompanyDetail.overallScore}/100
                          </div>
                        </div>
                        <div
                          className="rounded-2xl px-3 py-2 text-right"
                          style={{ background: "#FFFFFF", border: "1px solid #FCE7F3" }}
                        >
                          <div className="text-xs" style={{ color: "#6B7280", fontWeight: 700 }}>
                            Lecture
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: "#111827", fontWeight: 800 }}
                          >
                            {scoreLabel(selectedCompanyDetail.overallScore)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        <ScoreMetric
                          label="Inclusion"
                          value={selectedCompanyDetail.inclusionScore}
                          color="#E11D48"
                        />
                        <ScoreMetric
                          label="Équité"
                          value={selectedCompanyDetail.equalityScore}
                          color="#7C3AED"
                        />
                        <ScoreMetric
                          label="Accessibilité"
                          value={selectedCompanyDetail.accessibilityScore}
                          color="#0284C7"
                        />
                        <ScoreMetric
                          label="Impact social"
                          value={selectedCompanyDetail.socialImpactScore}
                          color="#059669"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <p style={{ color: "#111827", fontWeight: 800 }}>
                        Signaux visibles dès le recrutement
                      </p>
                      <div className="mt-3 grid gap-2">
                        {selectedCompanyDetail.hiringSignals.map((signal) => (
                          <div
                            key={signal}
                            className="rounded-2xl px-3 py-3 text-sm"
                            style={{ background: "#F9FAFB", color: "#4B5563", lineHeight: 1.7 }}
                          >
                            {signal}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <p style={{ color: "#111827", fontWeight: 800 }}>Questions à poser</p>
                      <div className="mt-3 grid gap-2">
                        {selectedCompanyDetail.questionsToAsk.map((question) => (
                          <div
                            key={question}
                            className="rounded-2xl px-3 py-3 text-sm"
                            style={{
                              background: "#FFFFFF",
                              border: "1px solid #E5E7EB",
                              color: "#4B5563",
                              lineHeight: 1.7,
                            }}
                          >
                            {question}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : detailError ? (
                  <div
                    className="rounded-3xl px-5 py-6 text-sm"
                    style={{ background: "#FFF8FA", color: "#B91C1C", lineHeight: 1.8 }}
                  >
                    Impossible de charger la fiche détaillée pour le moment.
                  </div>
                ) : (
                  <div
                    className="rounded-3xl px-5 py-6 text-sm"
                    style={{ background: "#FFF8FA", color: "#6B7280", lineHeight: 1.8 }}
                  >
                    Aucun profil ne correspond aux filtres actuels. Essaie un autre axe ou un
                    score minimum plus bas.
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          <section className="order-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm" style={{ color: "#6B7280", fontWeight: 700 }}>
                  {directoryLoading ? "Chargement..." : `${companies.length} entreprises analysées`}
                </p>
                <p className="text-sm" style={{ color: "#9CA3AF" }}>
                  Une lecture éditoriale autonome, sans relais vers d'autres espaces du site.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className="rounded-full border-0 px-3 py-1.5"
                  style={{ background: "#F9FAFB", color: "#4B5563", fontWeight: 700 }}
                >
                  {savedCount} en shortlist
                </Badge>
                {featuredCompany ? (
                  <Badge
                    className="rounded-full border-0 px-3 py-1.5"
                    style={{
                      background: engagementCard.lightColor,
                      color: engagementCard.accentColor,
                      fontWeight: 700,
                    }}
                  >
                    En tête: {featuredCompany.name}
                  </Badge>
                ) : null}
              </div>
            </div>

            {directoryError ? (
              <Card
                className="rounded-[28px] border"
                style={{
                  background: "#FFFFFF",
                  borderColor: "#FECACA",
                }}
              >
                <CardContent className="p-6">
                  <p className="text-sm" style={{ color: "#B91C1C", fontWeight: 700 }}>
                    Impossible de charger le module engagement pour le moment.
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {directoryLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <DirectorySkeletonCard key={index} />
                ))}
              </div>
            ) : companies.length === 0 ? (
              <Card
                className="rounded-[28px] border"
                style={{
                  background: "#FFFFFF",
                  borderColor: "rgba(244,63,94,0.10)",
                  boxShadow: "0 18px 36px rgba(15,23,42,0.04)",
                }}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: "#FFF1F2" }}
                  >
                    <Sparkles size={24} color={engagementCard.accentColor} />
                  </div>
                  <h3
                    className="mt-5 text-xl"
                    style={{ color: "#111827", fontWeight: 800, letterSpacing: "-0.03em" }}
                  >
                    Aucun profil ne ressort avec ces filtres
                  </h3>
                  <p
                    className="mx-auto mt-3 max-w-xl text-sm"
                    style={{ color: "#6B7280", lineHeight: 1.8 }}
                  >
                    Essaie un secteur plus large, retire le score minimum ou repasse en mode
                    "Tous" pour retrouver un panorama complet.
                  </p>
                  <Button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 rounded-2xl"
                    style={{
                      background: engagementCard.accentColor,
                      color: "#FFFFFF",
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {companies.map((company) => {
                  const active = company.id === selectedCompanyId;
                  const isSaved = savedIds.includes(company.id);

                  return (
                    <Card
                      key={company.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCompanyId(company.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedCompanyId(company.id);
                        }
                      }}
                      className="rounded-[28px] border transition-all duration-200"
                      style={{
                        background: "#FFFFFF",
                        borderColor: active ? "#FDA4AF" : "rgba(0,0,0,0.06)",
                        boxShadow: active
                          ? "0 20px 44px rgba(244,63,94,0.12)"
                          : "0 10px 28px rgba(15,23,42,0.04)",
                        transform: active ? "translateY(-2px)" : "translateY(0)",
                      }}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                className="rounded-full border-0 px-3 py-1"
                                style={{
                                  background: engagementCard.lightColor,
                                  color: engagementCard.accentColor,
                                  fontWeight: 800,
                                }}
                              >
                                {company.overallScore}/100
                              </Badge>
                              <Badge
                                className="rounded-full border-0 px-3 py-1"
                                style={{
                                  background: "#F9FAFB",
                                  color: "#4B5563",
                                  fontWeight: 700,
                                }}
                              >
                                {company.workModel}
                              </Badge>
                            </div>
                            <h3
                              className="mt-4 text-xl"
                              style={{
                                color: "#111827",
                                fontWeight: 800,
                                letterSpacing: "-0.03em",
                              }}
                            >
                              {company.name}
                            </h3>
                            <div
                              className="mt-2 flex flex-wrap items-center gap-3 text-sm"
                              style={{ color: "#6B7280", fontWeight: 600 }}
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <Building2 size={14} />
                                {company.sector}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin size={14} />
                                {company.location}
                              </span>
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleSave(company.id);
                            }}
                            className="rounded-full"
                            style={{
                              color: isSaved ? engagementCard.accentColor : "#9CA3AF",
                              background: isSaved ? "#FFF1F2" : "transparent",
                            }}
                          >
                            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                          </Button>
                        </div>

                        <p
                          className="mt-4 text-sm"
                          style={{ color: "#4B5563", lineHeight: 1.8 }}
                        >
                          {company.summary}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {company.labels.slice(0, 3).map((label) => {
                            const style = LABEL_STYLES[label.tone];
                            return (
                              <span
                                key={label.text}
                                className="rounded-full px-3 py-1 text-xs"
                                style={{
                                  background: style.background,
                                  color: style.color,
                                  fontWeight: 700,
                                }}
                              >
                                {label.text}
                              </span>
                            );
                          })}
                        </div>

                        <div className="mt-5 grid gap-3">
                          {company.initiativeHighlights.map((initiative) => (
                            <div
                              key={initiative.title}
                              className="rounded-2xl px-3 py-3"
                              style={{ background: "#F9FAFB" }}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p
                                  className="text-sm"
                                  style={{ color: "#111827", fontWeight: 700 }}
                                >
                                  {initiative.title}
                                </p>
                                <Badge
                                  className="rounded-full border-0 px-2.5 py-0.5 text-[11px]"
                                  style={{
                                    background: "#FFFFFF",
                                    color: "#6B7280",
                                    fontWeight: 700,
                                  }}
                                >
                                  {THEME_LABELS[initiative.theme]}
                                </Badge>
                              </div>
                              <p
                                className="mt-2 text-sm"
                                style={{ color: "#6B7280", lineHeight: 1.7 }}
                              >
                                {initiative.impact}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3">
                          <div className="text-sm" style={{ color: "#6B7280" }}>
                            <span style={{ fontWeight: 800, color: "#111827" }}>
                              {company.evidenceCount}
                            </span>{" "}
                            preuves listées
                          </div>
                          <div
                            className="inline-flex items-center gap-2 text-sm"
                            style={{
                              color: active ? engagementCard.accentColor : "#4B5563",
                              fontWeight: 800,
                            }}
                          >
                            {active ? "Fiche ouverte" : "Analyser la fiche"}
                            <ArrowUpRight size={14} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {selectedCompanyDetail ? (
              <Card
                className="mt-6 rounded-[28px] border"
                style={{
                  background: "#FFFFFF",
                  borderColor: "rgba(244,63,94,0.10)",
                  boxShadow: "0 18px 36px rgba(15,23,42,0.04)",
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p style={{ color: "#111827", fontWeight: 800 }}>
                        Initiatives documentées
                      </p>
                      <p className="text-sm" style={{ color: "#9CA3AF" }}>
                        Mise à jour le {formatDate(selectedCompanyDetail.reviewedAt)}
                      </p>
                    </div>
                    <Badge
                      className="rounded-full border-0 px-3 py-1.5"
                      style={{ background: "#F9FAFB", color: "#4B5563", fontWeight: 700 }}
                    >
                      {selectedCompanyDetail.size}
                    </Badge>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-2">
                    {selectedCompanyDetail.initiatives.map((initiative) => (
                      <div
                        key={initiative.title}
                        className="rounded-3xl border px-4 py-4"
                        style={{
                          background: "#FFFFFF",
                          borderColor: "#E5E7EB",
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p style={{ color: "#111827", fontWeight: 800 }}>{initiative.title}</p>
                          <Badge
                            className="rounded-full border-0 px-2.5 py-0.5 text-[11px]"
                            style={{
                              background: "#FFF8FA",
                              color: engagementCard.accentColor,
                              fontWeight: 700,
                            }}
                          >
                            {THEME_LABELS[initiative.theme]}
                          </Badge>
                        </div>
                        <p
                          className="mt-3 text-sm"
                          style={{ color: "#4B5563", lineHeight: 1.8 }}
                        >
                          {initiative.description}
                        </p>
                        <div
                          className="mt-4 rounded-2xl px-3 py-3 text-sm"
                          style={{
                            background: "#F9FAFB",
                            color: "#111827",
                            fontWeight: 700,
                            lineHeight: 1.7,
                          }}
                        >
                          {initiative.impact}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2">
                      <Star size={16} color={engagementCard.accentColor} />
                      <p style={{ color: "#111827", fontWeight: 800 }}>Éléments de preuve</p>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {selectedCompanyDetail.evidence.map((evidence) => (
                        <div
                          key={evidence.title}
                          className="rounded-3xl border px-4 py-4"
                          style={{
                            background: "#FFFFFF",
                            borderColor: "#E5E7EB",
                          }}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p style={{ color: "#111827", fontWeight: 800 }}>{evidence.title}</p>
                            <Badge
                              className="rounded-full border-0 px-3 py-1"
                              style={{
                                background: "#F5F3FF",
                                color: "#7C3AED",
                                fontWeight: 700,
                              }}
                            >
                              {evidence.source}
                            </Badge>
                          </div>
                          <p
                            className="mt-2 text-sm"
                            style={{ color: "#6B7280", lineHeight: 1.7 }}
                          >
                            {evidence.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </section>
        </section>
      </main>
    </div>
  );
}
