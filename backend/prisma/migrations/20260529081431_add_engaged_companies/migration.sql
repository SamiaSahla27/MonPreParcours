-- CreateTable
CREATE TABLE "EngagedCompany" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "workModel" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "pitch" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "inclusionScore" INTEGER NOT NULL,
    "equalityScore" INTEGER NOT NULL,
    "accessibilityScore" INTEGER NOT NULL,
    "socialImpactScore" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "labels" JSONB NOT NULL,
    "themes" TEXT[],
    "hiringSignals" TEXT[],
    "initiatives" JSONB NOT NULL,
    "questionsToAsk" TEXT[],
    "evidence" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EngagedCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EngagedCompany_slug_key" ON "EngagedCompany"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EngagedCompany_name_key" ON "EngagedCompany"("name");

-- CreateIndex
CREATE INDEX "EngagedCompany_slug_idx" ON "EngagedCompany"("slug");

-- CreateIndex
CREATE INDEX "EngagedCompany_name_idx" ON "EngagedCompany"("name");

-- CreateIndex
CREATE INDEX "EngagedCompany_sector_idx" ON "EngagedCompany"("sector");

-- CreateIndex
CREATE INDEX "EngagedCompany_overallScore_idx" ON "EngagedCompany"("overallScore");

-- CreateIndex
CREATE INDEX "EngagedCompany_reviewedAt_idx" ON "EngagedCompany"("reviewedAt");
