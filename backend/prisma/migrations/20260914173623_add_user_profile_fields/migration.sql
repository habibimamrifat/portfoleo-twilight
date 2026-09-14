/*
  Warnings:

  - You are about to drop the column `availability` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `githubUrl` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `siteName` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `tagline` on the `SystemSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SystemSettings" DROP COLUMN "availability",
DROP COLUMN "description",
DROP COLUMN "email",
DROP COLUMN "githubUrl",
DROP COLUMN "linkedinUrl",
DROP COLUMN "location",
DROP COLUMN "phone",
DROP COLUMN "profileImage",
DROP COLUMN "resumeUrl",
DROP COLUMN "siteName",
DROP COLUMN "tagline",
ADD COLUMN     "backgroundColor" TEXT,
ADD COLUMN     "buttonColor" TEXT,
ADD COLUMN     "cardColor" TEXT,
ADD COLUMN     "moonlightColor" TEXT,
ADD COLUMN     "particleColor" TEXT,
ADD COLUMN     "particleCount" INTEGER,
ADD COLUMN     "particleLinkColor" TEXT,
ADD COLUMN     "particleLinksEnabled" BOOLEAN;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "resumeUrl" TEXT;

-- CreateTable
CREATE TABLE "ProjectApproachStep" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectApproachStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectApproachStep_projectId_idx" ON "ProjectApproachStep"("projectId");

-- CreateIndex
CREATE INDEX "ProjectApproachStep_projectId_sortOrder_idx" ON "ProjectApproachStep"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProcessStep_userId_sortOrder_idx" ON "ProcessStep"("userId", "sortOrder");

-- AddForeignKey
ALTER TABLE "ProjectApproachStep" ADD CONSTRAINT "ProjectApproachStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
