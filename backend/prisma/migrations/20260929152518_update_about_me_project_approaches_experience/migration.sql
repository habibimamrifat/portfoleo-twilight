/*
  Warnings:

  - The `responsibilities` column on the `Experience` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `learned` column on the `Experience` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `approachTaken` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `ProjectApproachStep` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectApproachStep" DROP CONSTRAINT "ProjectApproachStep_projectId_fkey";

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "responsibilities",
ADD COLUMN     "responsibilities" TEXT[],
DROP COLUMN "learned",
ADD COLUMN     "learned" TEXT[];

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "approachTaken";

-- DropTable
DROP TABLE "ProjectApproachStep";

-- CreateTable
CREATE TABLE "AboutMe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "detailAboutMe" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutMe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSector" (
    "id" TEXT NOT NULL,
    "aboutMeId" TEXT NOT NULL,
    "sectorImg" TEXT NOT NULL,
    "sectorName" TEXT NOT NULL,
    "sectorDetail" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkSector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectApproach" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "approachImg" TEXT,
    "approachTitle" TEXT NOT NULL,
    "detail" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectApproach_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AboutMe_userId_key" ON "AboutMe"("userId");

-- CreateIndex
CREATE INDEX "AboutMe_userId_idx" ON "AboutMe"("userId");

-- CreateIndex
CREATE INDEX "WorkSector_aboutMeId_idx" ON "WorkSector"("aboutMeId");

-- CreateIndex
CREATE INDEX "WorkSector_aboutMeId_sortOrder_idx" ON "WorkSector"("aboutMeId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProjectApproach_projectId_idx" ON "ProjectApproach"("projectId");

-- CreateIndex
CREATE INDEX "ProjectApproach_projectId_sortOrder_idx" ON "ProjectApproach"("projectId", "sortOrder");

-- AddForeignKey
ALTER TABLE "AboutMe" ADD CONSTRAINT "AboutMe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSector" ADD CONSTRAINT "WorkSector_aboutMeId_fkey" FOREIGN KEY ("aboutMeId") REFERENCES "AboutMe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectApproach" ADD CONSTRAINT "ProjectApproach_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
