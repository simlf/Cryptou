/*
  Warnings:

  - A unique constraint covering the columns `[keyword]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "lastArticleDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_keyword_key" ON "Keyword"("keyword");
