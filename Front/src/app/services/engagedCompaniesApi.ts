const DEFAULT_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "/api";

function joinUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export type EngagementTheme =
  | "inclusion"
  | "equity"
  | "accessibility"
  | "social-impact";

export type EngagementSortKey = "impact" | "recent" | "alphabetical";

export interface EngagementLabel {
  text: string;
  tone: "rose" | "violet" | "emerald" | "sky" | "amber";
}

export interface EngagementInitiative {
  title: string;
  theme: EngagementTheme;
  description: string;
  impact: string;
}

export interface EngagementEvidence {
  title: string;
  source: string;
  note: string;
}

export interface EngagedCompanyListItem {
  id: string;
  slug: string;
  name: string;
  sector: string;
  location: string;
  workModel: string;
  summary: string;
  overallScore: number;
  labels: EngagementLabel[];
  initiativeHighlights: Array<
    Pick<EngagementInitiative, "title" | "theme" | "impact">
  >;
  evidenceCount: number;
}

export interface EngagedCompanyDetail extends EngagedCompanyListItem {
  size: string;
  pitch: string;
  inclusionScore: number;
  equalityScore: number;
  accessibilityScore: number;
  socialImpactScore: number;
  reviewedAt: string;
  themes: EngagementTheme[];
  hiringSignals: string[];
  initiatives: EngagementInitiative[];
  questionsToAsk: string[];
  evidence: EngagementEvidence[];
}

export interface EngagedCompaniesOverview {
  companyCount: number;
  evidenceEntryCount: number;
  sectors: string[];
}

export interface EngagedCompaniesQuery {
  query?: string;
  sector?: string;
  theme?: EngagementTheme | "all";
  minScore?: number;
  sort?: EngagementSortKey;
  baseUrl?: string;
}

export async function getEngagedCompaniesOverview(params: { baseUrl?: string } = {}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const res = await fetch(joinUrl(baseUrl, "/engaged-companies/overview"));
  if (!res.ok) throw new Error(`ENGAGED_COMPANIES_OVERVIEW_FAILED_${res.status}`);
  return (await res.json()) as EngagedCompaniesOverview;
}

export async function listEngagedCompanies(params: EngagedCompaniesQuery = {}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const searchParams = new URLSearchParams();

  if (params.query?.trim()) searchParams.set("q", params.query.trim());
  if (params.sector?.trim()) searchParams.set("sector", params.sector.trim());
  if (params.theme && params.theme !== "all") searchParams.set("theme", params.theme);
  if (typeof params.minScore === "number" && params.minScore > 0) {
    searchParams.set("minScore", String(params.minScore));
  }
  if (params.sort) searchParams.set("sort", params.sort);

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const res = await fetch(`${joinUrl(baseUrl, "/engaged-companies")}${suffix}`);
  if (!res.ok) throw new Error(`ENGAGED_COMPANIES_LIST_FAILED_${res.status}`);
  return (await res.json()) as EngagedCompanyListItem[];
}

export async function getEngagedCompany(
  id: string,
  params: { baseUrl?: string } = {},
) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const res = await fetch(
    `${joinUrl(baseUrl, "/engaged-companies")}/${encodeURIComponent(id)}`,
  );
  if (!res.ok) throw new Error(`ENGAGED_COMPANY_GET_FAILED_${res.status}`);
  return (await res.json()) as EngagedCompanyDetail;
}
