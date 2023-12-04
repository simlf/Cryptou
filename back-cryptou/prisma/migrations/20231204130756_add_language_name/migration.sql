-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'EUR',
    "role" INTEGER NOT NULL,
    "keywords" TEXT,
    "token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feed" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "languageName" TEXT NOT NULL,
    "lastFetched" TIMESTAMP(3),
    "lastArticleDate" TIMESTAMP(3),

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cryptocurrency" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "slugName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Cryptocurrency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "imageUrl" TEXT,
    "feedId" INTEGER NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleKeyword" (
    "id" SERIAL NOT NULL,
    "keywordId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,

    CONSTRAINT "ArticleKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "role" "RoleName" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Feed_url_key" ON "Feed"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Cryptocurrency_fullName_key" ON "Cryptocurrency"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Article_pageUrl_key" ON "Article"("pageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_keyword_key" ON "Keyword"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "Role"("role");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleKeyword" ADD CONSTRAINT "ArticleKeyword_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleKeyword" ADD CONSTRAINT "ArticleKeyword_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
