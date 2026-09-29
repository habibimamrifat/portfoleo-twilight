/*
  Warnings:

  - The `primaryText` column on the `BannerQuote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `secondaryText` column on the `BannerQuote` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BannerQuote" DROP COLUMN "primaryText",
ADD COLUMN     "primaryText" TEXT[],
DROP COLUMN "secondaryText",
ADD COLUMN     "secondaryText" TEXT[];
