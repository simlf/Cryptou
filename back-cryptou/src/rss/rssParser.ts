import Parser from "rss-parser";
import { PrismaClient } from "@prisma/client";
import keywordExtractor from "keyword-extractor";

class RssParser {
  private parser: Parser;
  private prisma: PrismaClient;

  constructor() {
    this.parser = new Parser();
    this.prisma = new PrismaClient();
  }

  public async parseAndStore(
    feedId: number,
    feedContent: string,
    lastArticleDate: Date
  ): Promise<void> {
    const feed = await this.parser.parseString(feedContent);

    for (const item of feed.items) {
      const articleDate = new Date(item.pubDate || Date.now());
      if (!lastArticleDate || articleDate > lastArticleDate) {
        const keywords = this.extractKeywords(
          item.contentSnippet || item.content || ""
        );
        await this.storeArticleWithKeywords(feedId, item, keywords);
      }
    }
  }

  private async storeArticleWithKeywords(
    feedId: number,
    item: Parser.Item,
    keywords: string[]
  ): Promise<void> {
    const articleDate = new Date(item.pubDate || Date.now());
    const imageUrl = this.extractImageUrl(item);

    await this.prisma.$transaction(async (prisma: any) => {
      const existingArticle = await prisma.article.findUnique({
        where: { pageUrl: item.link || "" },
      });

      if (!existingArticle) {
        const newArticle = await prisma.article.create({
          data: {
            title: item.title || "Untitled",
            summary: item.contentSnippet || item.content || "",
            source: item.link || "Unknown",
            date: articleDate,
            pageUrl: item.link || "",
            imageUrl: imageUrl,
          },
        });

        for (const keywordText of keywords) {
          let keyword = await prisma.keyword.upsert({
            where: { keyword: keywordText },
            update: {},
            create: { keyword: keywordText },
          });

          await prisma.articleKeyword.create({
            data: {
              articleId: newArticle.id,
              keywordId: keyword.id,
            },
          });
        }

        // Update the lastArticleDate for the feed
        await prisma.feed.update({
          where: { id: feedId },
          data: { lastArticleDate: articleDate },
        });
      } else {
        console.log(`Skipping article ${item.link} - already exists.`);
      }
    });
  }

  private extractKeywords(content: string): string[] {
    return keywordExtractor.extract(content, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });
  }

  private extractImageUrl(item: Parser.Item): string {
    if (
      item.enclosure &&
      item.enclosure.url &&
      item.enclosure.type &&
      item.enclosure.type.startsWith("image/")
    ) {
      return item.enclosure.url;
    }

    const descriptionContent = item.content || item.contentSnippet || "";
    const imgRegex = /<img.*?src=["'](.*?)["']/;
    const imgMatch = descriptionContent.match(imgRegex);
    if (imgMatch) {
      return imgMatch[1];
    }
    return "";
  }
}
export default RssParser;
