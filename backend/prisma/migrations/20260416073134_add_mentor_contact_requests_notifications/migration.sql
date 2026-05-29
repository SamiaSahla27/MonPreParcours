-- CreateEnum
CREATE TYPE "MentorContactRequestStatus" AS ENUM ('pending', 'accepted', 'refused');

-- CreateEnum
CREATE TYPE "AppNotificationType" AS ENUM ('mentor_request_pending', 'mentor_request_accepted', 'mentor_request_refused');

-- CreateTable
CREATE TABLE "MentorContactRequest" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "message" TEXT,
    "status" "MentorContactRequestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "MentorContactRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AppNotificationType" NOT NULL,
    "mentorId" TEXT,
    "etudiantId" TEXT,
    "requestId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MentorContactRequest_mentorId_status_createdAt_idx" ON "MentorContactRequest"("mentorId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "MentorContactRequest_etudiantId_status_createdAt_idx" ON "MentorContactRequest"("etudiantId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "AppNotification_userId_createdAt_idx" ON "AppNotification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AppNotification_requestId_idx" ON "AppNotification"("requestId");

-- AddForeignKey
ALTER TABLE "MentorContactRequest" ADD CONSTRAINT "MentorContactRequest_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorContactRequest" ADD CONSTRAINT "MentorContactRequest_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppNotification" ADD CONSTRAINT "AppNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppNotification" ADD CONSTRAINT "AppNotification_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "MentorContactRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
