import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ENGAGED_COMPANIES_SEED_DATA } from './engaged-companies.seed-data';

const prisma = new PrismaClient();

async function upsertProfession(name: string) {
  return prisma.profession.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function upsertSkill(name: string) {
  return prisma.skill.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function upsertLocation(params: {
  label: string;
  city?: string;
  country?: string;
}) {
  const existing = await prisma.location.findFirst({
    where: {
      label: params.label,
      city: params.city ?? null,
      country: params.country ?? null,
    },
  });

  if (existing) return existing;

  return prisma.location.create({
    data: {
      label: params.label,
      city: params.city,
      country: params.country,
    },
  });
}

async function createMentor(params: {
  email: string;
  password: string;
  fullName: string;
  description: string;
  professionName: string;
  skills: string[];
  locationLabel?: string;
  city?: string;
  country?: string;
  phone?: string;
  imageUrl?: string;
  emailPublic?: string;
}) {
  const profession = await upsertProfession(params.professionName);

  const location = params.locationLabel
    ? await upsertLocation({
        label: params.locationLabel,
        city: params.city,
        country: params.country,
      })
    : null;

  const passwordHash = await bcrypt.hash(params.password, 10);

  const user = await prisma.user.upsert({
    where: { email: params.email },
    update: {
      role: UserRole.mentor,
    },
    create: {
      email: params.email,
      passwordHash,
      role: UserRole.mentor,
    },
  });

  const profile = await prisma.mentorProfile.upsert({
    where: { userId: user.id },
    update: {
      fullName: params.fullName,
      description: params.description,
      phone: params.phone,
      imageUrl: params.imageUrl,
      emailPublic: params.emailPublic,
      professionId: profession.id,
      locationId: location?.id ?? null,
    },
    create: {
      userId: user.id,
      fullName: params.fullName,
      description: params.description,
      phone: params.phone,
      imageUrl: params.imageUrl,
      emailPublic: params.emailPublic,
      professionId: profession.id,
      locationId: location?.id ?? null,
    },
  });

  // Skills
  const skillRecords = await Promise.all(params.skills.map((s) => upsertSkill(s)));

  await prisma.mentorSkill.deleteMany({
    where: { mentorProfileId: profile.id },
  });

  await prisma.mentorSkill.createMany({
    data: skillRecords.map((s) => ({
      mentorProfileId: profile.id,
      skillId: s.id,
    })),
    skipDuplicates: true,
  });
}

async function upsertEngagedCompanies() {
  for (const company of ENGAGED_COMPANIES_SEED_DATA) {
    const labels = company.labels as unknown as Prisma.InputJsonValue;
    const initiatives = company.initiatives as unknown as Prisma.InputJsonValue;
    const evidence = company.evidence as unknown as Prisma.InputJsonValue;

    await prisma.engagedCompany.upsert({
      where: { slug: company.slug },
      update: {
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
        reviewedAt: new Date(company.reviewedAt),
        labels,
        themes: company.themes,
        hiringSignals: company.hiringSignals,
        initiatives,
        questionsToAsk: company.questionsToAsk,
        evidence,
      },
      create: {
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
        reviewedAt: new Date(company.reviewedAt),
        labels,
        themes: company.themes,
        hiringSignals: company.hiringSignals,
        initiatives,
        questionsToAsk: company.questionsToAsk,
        evidence,
      },
    });
  }
}

async function main() {
  await createMentor({
    email: 'mentor.ds@example.com',
    password: 'Password123!',
    fullName: 'Samira Benali',
    professionName: 'Data Scientist',
    description:
      "J’aide les étudiants à se lancer en data: CV, portfolio, préparation d’entretiens, et projets ML de bout en bout.",
    skills: ['Python', 'Machine Learning', 'SQL', 'DataViz'],
    locationLabel: 'Télétravail / Paris',
    city: 'Paris',
    country: 'France',
    phone: '+33 6 12 34 56 78',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    emailPublic: 'samira.benali@example.com',
  });

  await createMentor({
    email: 'mentor.ux@example.com',
    password: 'Password123!',
    fullName: 'Thomas Leroy',
    professionName: 'UX Designer',
    description:
      "Mentor UX: recherche utilisateur, design system, tests, et construction de cas d’étude pour candidatures.",
    skills: ['Figma', 'User Research', 'Design System'],
    locationLabel: 'Lyon',
    city: 'Lyon',
    country: 'France',
    imageUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=600&q=80',
    emailPublic: 'thomas.leroy@example.com',
  });

  await createMentor({
    email: 'mentor.react@example.com',
    password: 'Password123!',
    fullName: 'Aïcha Ndiaye',
    professionName: 'Développeuse Frontend',
    description:
      "Spécialisée React/TypeScript. Je t’accompagne sur les bonnes pratiques, tests, et préparation aux entretiens front.",
    skills: ['React', 'TypeScript', 'Testing', 'Performance'],
    locationLabel: 'Remote',
    imageUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=600&q=80',
    emailPublic: 'aicha.ndiaye@example.com',
  });

  await upsertEngagedCompanies();

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
