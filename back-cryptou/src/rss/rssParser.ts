import Parser from 'rss-parser';
import { PrismaClient } from '@prisma/client';
import keywordExtractor from 'keyword-extractor';

class RssParser {
    private parser: Parser;
    private prisma: PrismaClient;

    constructor() {
        this.parser = new Parser();
        this.prisma = new PrismaClient();
    }

    public async parseAndStore(feedId: number, feedContent: string, lastArticleDate: Date): Promise<void> {
        const feed = await this.parser.parseString(feedContent);

        for (const item of feed.items) {
            const articleDate = new Date(item.pubDate || Date.now());
            if (!lastArticleDate || articleDate > lastArticleDate) {
                const keywords = this.extractKeywords(item.contentSnippet || item.content || '');
                await this.storeArticleWithKeywords(feedId, item, keywords);
            }
        }
    }

    private async storeArticleWithKeywords(feedId: number, item: Parser.Item, keywords: string[]): Promise<void> {
        const articleDate = new Date(item.pubDate || Date.now());
        const imageUrl = this.extractImageUrl(item);

        await this.prisma.$transaction(async (prisma) => {
            const newArticle = await prisma.article.create({
                data: {
                    title: item.title || 'Untitled',
                    summary: item.contentSnippet || item.content || '',
                    source: item.link || 'Unknown',
                    date: articleDate,
                    pageUrl: item.link || '',
                    imageUrl: imageUrl,
                },
            });

            for (const keywordText of keywords) {
                let keyword = await prisma.keyword.upsert({
                    where: {keyword: keywordText},
                    update: {},
                    create: {keyword: keywordText},
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
                where: {id: feedId},
                data: {lastArticleDate: articleDate},
            });
        });
    }

    private extractKeywords(content: string): string[] {
        return keywordExtractor.extract(content, {
            language: "english",
            remove_digits: true,
            return_changed_case: true,
            remove_duplicates: true
        });
    }

    private extractImageUrl(item: Parser.Item): string {
        // Check the 'media:content' tag
        const mediaContent = (item as any)['media:content'] as { url: string; type: string } | undefined;
        if (mediaContent && mediaContent.url && mediaContent.type && mediaContent.type.startsWith('image/')) {
            return mediaContent.url;
        }

        // Check the 'enclosure' tag
        if (item.enclosure && item.enclosure.url && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
            return item.enclosure.url;
        }

        // Check for images embedded in 'description' content
        const descriptionContent = item.content || item.contentSnippet || '';
        const imgRegex = /<img.*?src=["'](.*?)["']/;
        const imgMatch = descriptionContent.match(imgRegex);
        if (imgMatch) {
            return imgMatch[1];
        }

        // No image found
        return '';
    }
}
export default RssParser;


// import Parser from 'rss-parser';
// import { PrismaClient } from '@prisma/client';
// import keywordExtractor from 'keyword-extractor';
//
// class RssParser {
//     private parser: Parser;
//     private prisma: PrismaClient;
//
//     constructor() {
//         this.parser = new Parser();
//         this.prisma = new PrismaClient();
//     }
//
//     public async parseAndStore(feedContent: string): Promise<void> {
//         const feed = await this.parser.parseString(feedContent);
//
//         for (const item of feed.items) {
//             const keywords = this.extractKeywords(item.contentSnippet || item.content || '');
//             await this.storeArticleWithKeywords(item, keywords);
//         }
//     }
//
//     private extractKeywords(content: string): string[] {
//         return keywordExtractor.extract(content, {
//             language: "english",
//             remove_digits: true,
//             return_changed_case: true,
//             remove_duplicates: true
//         });
//     }
//
//     private async storeArticleWithKeywords(feedId: number, item: Parser.Item, keywords: string[]): Promise<void> {
//         const articleDate = new Date(item.pubDate || Date.now());
//         const imageUrl = this.extractImageUrl(item);
//
//         await this.prisma.$transaction(async (prisma) => {
//             // Check if the article is newer than the last stored article for the feed
//             const feed = await prisma.feed.findUnique({
//                 where: { id: feedId },
//             });
//
//             if (!feed.lastArticleDate || articleDate > feed.lastArticleDate) {
//                 const newArticle = await prisma.article.create({
//                     data: {
//                         title: item.title || 'Untitled',
//                         summary: item.contentSnippet || item.content || '',
//                         source: item.link || 'Unknown',
//                         date: articleDate,
//                         pageUrl: item.link || '',
//                         imageUrl: imageUrl,
//                     },
//                 });
//
//                 for (const keywordText of keywords) {
//                     let keyword = await prisma.keyword.upsert({
//                         where: { keyword: keywordText },
//                         update: {},
//                         create: { keyword: keywordText },
//                     });
//
//                     await prisma.articleKeyword.create({
//                         data: {
//                             articleId: newArticle.id,
//                             keywordId: keyword.id,
//                         },
//                     });
//                 }
//
//                 // Update the lastArticleDate for the feed
//                 await prisma.feed.update({
//                     where: { id: feedId },
//                     data: { lastArticleDate: articleDate },
//                 });
//             }
//         });
//     }
//
//     // private async storeArticleWithKeywords(item: Parser.Item, keywords: string[]): Promise<void> {
//     //     const imageUrl = this.extractImageUrl(item);
//     //
//     //     await this.prisma.$transaction(async (prisma) => {
//     //         const newArticle = await prisma.article.create({
//     //             data: {
//     //                 title: item.title || 'Untitled',
//     //                 summary: item.contentSnippet || item.content || '',
//     //                 source: item.link || 'Unknown',
//     //                 date: new Date(item.pubDate || Date.now()),
//     //                 pageUrl: item.link || '',
//     //                 imageUrl: imageUrl,
//     //             },
//     //         });
//     //
//     //         for (const keywordText of keywords) {
//     //             let keyword = await prisma.keyword.findUnique({
//     //                 where: { keyword: keywordText },
//     //             });
//     //
//     //             if (!keyword) {
//     //                 keyword = await prisma.keyword.create({
//     //                     data: { keyword: keywordText },
//     //                 });
//     //             }
//     //
//     //             await prisma.articleKeyword.create({
//     //                 data: {
//     //                     articleId: newArticle.id,
//     //                     keywordId: keyword.id,
//     //                 },
//     //             });
//     //         }
//     //     });
//     // }
//
//     private extractImageUrl(item: Parser.Item): string {
//         // Assuming mediaContent is a part of the item but not recognized by TypeScript
//         const mediaContent = (item as any)['media:content'] as { url: string; type: string } | undefined;
//         if (mediaContent?.type?.startsWith('image/')) {
//             return mediaContent.url;
//         }
//         // Check enclosure tag
//         if (item.enclosure?.type?.startsWith('image/')) {
//             return item.enclosure.url;
//         }
//
//         // Check for images embedded in description/content
//         const htmlContent = item.content || item.contentSnippet || '';
//         const imgRegex = /<img.*?src=["'](.*?)["']/;
//         const imgMatch = htmlContent.match(imgRegex);
//         if (imgMatch) {
//             return imgMatch[1];
//         }
//
//         // No image found
//         return '';
//     }
// }
//
// export default RssParser;
