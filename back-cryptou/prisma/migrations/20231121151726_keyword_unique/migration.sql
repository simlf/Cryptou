/*
  Warnings:

  - You are about to drop the column `currentPrice` on the `Cryptocurrency` table. All the data in the column will be lost.
  - You are about to drop the column `highestPriceOfDay` on the `Cryptocurrency` table. All the data in the column will be lost.
  - You are about to drop the column `lowestPriceOfDay` on the `Cryptocurrency` table. All the data in the column will be lost.
  - You are about to drop the column `openingPrice` on the `Cryptocurrency` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[keyword]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cryptocurrency" DROP COLUMN "currentPrice",
DROP COLUMN "highestPriceOfDay",
DROP COLUMN "lowestPriceOfDay",
DROP COLUMN "openingPrice";

-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "lastArticleDate" TIMESTAMP(3),
ALTER COLUMN "lastFetched" DROP NOT NULL,
ALTER COLUMN "lastFetched" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_keyword_key" ON "Keyword"("keyword");
