import { Injectable } from '@nestjs/common';
import { EngagedCompany, Prisma } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';

const VALID_THEMES = [
  'inclusion',
  'equity',
  'accessibility',
  'social-impact',
] as const;

const VALID_SORTS = ['impact', 'recent', 'alphabetical'] as const;

type EngagementTheme = (typeof VALID_THEMES)[number];
type EngagementSortKey = (typeof VALID_SORTS)[number];
type EngagementLabelTone = 'rose' | 'violet' | 'emerald' | 'sky' | 'amber';

type EngagementLabel = {
  text: string;
  tone: EngagementLabelTone;
};

type EngagementInitiative = {
  title: string;
  theme: EngagementTheme;
  description: string;
  impact: string;
};

type EngagementEvidence = {
  title: string;
  source: string;
  note: string;
};

export type EngagedCompanyListItem = {
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
    Pick<EngagementInitiative, 'title' | 'theme' | 'impact'>
  >;
  evidenceCount: number;
};

export type EngagedCompanyDetail = EngagedCompanyListItem & {
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
};

export type EngagedCompaniesOverview = {
  companyCount: number;
  evidenceEntryCount: number;
  sectors: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTheme(value: string): value is EngagementTheme {
  return (VALID_THEMES as readonly string[]).includes(value);
}

function isSortKey(value: string): value is EngagementSortKey {
  return (VALID_SORTS as readonly string[]).includes(value);
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string');
}

function normalizeLabels(value: Prisma.JsonValue): EngagementLabel[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    if (typeof entry.text !== 'string' || typeof entry.tone !== 'string') return [];
    if (!['rose', 'violet', 'emerald', 'sky', 'amber'].includes(entry.tone)) return [];

    return [
      {
        text: entry.text,
        tone: entry.tone as EngagementLabelTone,
      },
    ];
  });
}

function normalizeInitiatives(value: Prisma.JsonValue): EngagementInitiative[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    if (
      typeof entry.title !== 'string' ||
      typeof entry.theme !== 'string' ||
      typeof entry.description !== 'string' ||
      typeof entry.impact !== 'string' ||
      !isTheme(entry.theme)
    ) {
      return [];
    }

    return [
      {
        title: entry.title,
        theme: entry.theme,
        description: entry.description,
        impact: entry.impact,
      },
    ];
  });
}

function normalizeEvidence(value: Prisma.JsonValue): EngagementEvidence[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    if (
      typeof entry.title !== 'string' ||
      typeof entry.source !== 'string' ||
      typeof entry.note !== 'string'
    ) {
      return [];
    }

    return [
      {
        title: entry.title,
        source: entry.source,
        note: entry.note,
      },
    ];
  });
}

function getThemeScore(
  company: EngagedCompanyDetail,
  theme?: EngagementTheme | null,
): number {
  switch (theme) {
    case 'inclusion':
      return company.inclusionScore;
    case 'equity':
      return company.equalityScore;
    case 'accessibility':
      return company.accessibilityScore;
    case 'social-impact':
      return company.socialImpactScore;
    default:
      return company.overallScore;
  }
}

function matchesQuery(company: EngagedCompanyDetail, rawQuery?: string): boolean {
  const query = rawQuery?.trim().toLowerCase();
  if (!query) return true;

  const haystack = [
    company.name,
    company.sector,
    company.location,
    company.summary,
    company.pitch,
    company.workModel,
    ...company.labels.map((label) => label.text),
    ...company.hiringSignals,
    ...company.questionsToAsk,
    ...company.initiatives.flatMap((initiative) => [
      initiative.title,
      initiative.description,
      initiative.impact,
    ]),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

function sortCompanies(
  companies: EngagedCompanyDetail[],
  sort: EngagementSortKey,
  theme?: EngagementTheme | null,
) {
  return [...companies].sort((a, b) => {
    if (sort === 'alphabetical') {
      return a.name.localeCompare(b.name, 'fr');
    }

    if (sort === 'recent') {
      return Date.parse(b.reviewedAt) - Date.parse(a.reviewedAt);
    }

    const scoreDelta = getThemeScore(b, theme) - getThemeScore(a, theme);
    if (scoreDelta !== 0) return scoreDelta;
    return b.overallScore - a.overallScore;
  });
}

function mapToDetail(company: EngagedCompany): EngagedCompanyDetail {
  const labels = normalizeLabels(company.labels);
  const initiatives = normalizeInitiatives(company.initiatives);
  const evidence = normalizeEvidence(company.evidence);
  const themes = company.themes.filter(isTheme);

  return {
    id: company.id,
    slug: company.slug,
    name: company.name,
    sector: company.sector,
    location: company.location,
    size: company.size,
    workModel: company.workModel,
    summary: company.summary,
    pitch: company.pitch,
    overallScore: company.overallScore,
    inclusionScore: company.inclusionScore,
    equalityScore: company.equalityScore,
    accessibilityScore: company.accessibilityScore,
    socialImpactScore: company.socialImpactScore,
    reviewedAt: company.reviewedAt.toISOString(),
    labels,
    themes,
    hiringSignals: normalizeStringArray(company.hiringSignals),
    initiatives,
    questionsToAsk: normalizeStringArray(company.questionsToAsk),
    evidence,
    initiativeHighlights: initiatives.slice(0, 2).map((initiative) => ({
      title: initiative.title,
      theme: initiative.theme,
      impact: initiative.impact,
    })),
    evidenceCount: evidence.length,
  };
}

function mapToListItem(company: EngagedCompanyDetail): EngagedCompanyListItem {
  return {
    id: company.id,
    slug: company.slug,
    name: company.name,
    sector: company.sector,
    location: company.location,
    workModel: company.workModel,
    summary: company.summary,
    overallScore: company.overallScore,
    labels: company.labels,
    initiativeHighlights: company.initiativeHighlights,
    evidenceCount: company.evidenceCount,
  };
}

@Injectable()
export class EngagedCompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<EngagedCompaniesOverview> {
    const companies = await this.prisma.engagedCompany.findMany({
      select: {
        sector: true,
        evidence: true,
      },
    });

    const sectors = Array.from(new Set(companies.map((company) => company.sector))).sort(
      (a, b) => a.localeCompare(b, 'fr'),
    );

    const evidenceEntryCount = companies.reduce(
      (count, company) => count + normalizeEvidence(company.evidence).length,
      0,
    );

    return {
      companyCount: companies.length,
      evidenceEntryCount,
      sectors,
    };
  }

  async list(params: {
    query?: string;
    sector?: string;
    theme?: string;
    minScore?: number;
    sort?: string;
  }): Promise<EngagedCompanyListItem[]> {
    const theme = params.theme && isTheme(params.theme) ? params.theme : null;
    const sort = params.sort && isSortKey(params.sort) ? params.sort : 'impact';
    const minScore = Number.isFinite(params.minScore) ? Math.max(0, params.minScore ?? 0) : 0;

    const companies = await this.prisma.engagedCompany.findMany({
      orderBy: { name: 'asc' },
    });

    const filtered = companies
      .map(mapToDetail)
      .filter((company) => {
        if (params.sector && params.sector !== 'Tous les secteurs' && company.sector !== params.sector) {
          return false;
        }

        if (theme && !company.themes.includes(theme)) {
          return false;
        }

        if (company.overallScore < minScore) {
          return false;
        }

        return matchesQuery(company, params.query);
      });

    return sortCompanies(filtered, sort, theme).map(mapToListItem);
  }

  async getById(idOrSlug: string): Promise<EngagedCompanyDetail | null> {
    const company = await this.prisma.engagedCompany.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!company) return null;
    return mapToDetail(company);
  }
}
