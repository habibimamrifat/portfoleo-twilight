-- AlterTable
ALTER TABLE "ProcessStep" ADD COLUMN     "img" TEXT;

-- CreateTable
CREATE TABLE "BannerQuote" (
    "id" TEXT NOT NULL,
    "primaryText" TEXT NOT NULL,
    "secondaryText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BannerQuote_pkey" PRIMARY KEY ("id")
);
