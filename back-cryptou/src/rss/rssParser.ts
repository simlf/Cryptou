import Parser, {Item} from 'rss-parser';
import { PrismaClient } from '@prisma/client';
import keywordExtractor from 'keyword-extractor';

interface MediaContent {
    $: {
        url: string;
        type?: string;
        height?: string;
        width?: string;
    };
}

interface ExtendedItem extends Item {
    mediaContent?: MediaContent;
    mediaThumbnail?: MediaContent;
}

class RssParser {
    private parser: Parser<ExtendedItem>;
    private prisma: PrismaClient;

    constructor() {
        this.parser = new Parser({
            customFields: {
                item: [
                    ['media:content', 'mediaContent'],
                    ['media:thumbnail', 'mediaThumbnail']
                ]
            }
        });
        this.prisma = new PrismaClient();
    }

    public async canParseFeed(feedContent: string): Promise<boolean> {
        try {
            const feed = await this.parser.parseString(feedContent);

            // Check if the feed has at least one item and validate its structure
            if (feed.items && feed.items.length > 0) {
                const firstItem = feed.items[0];
                if (firstItem.title && firstItem.link) {
                    return true;
                }
            }
            return false;
        } catch (err) {
            console.error('canParseFeed():', err);
            return false;
        }
    }

    public async parseAndStore(feedId: number, feedContent: string, lastArticleDate: Date): Promise<void> {
        await this.parser.parseString(feedContent, async (err, feed) => {
            if (err) {
                console.error(err);
                return;
            }
            for (const item of feed.items) {
                const articleDate = new Date(item.pubDate || Date.now());
                if (!lastArticleDate || articleDate > lastArticleDate) {
                    const keywords = this.extractKeywords(item.contentSnippet || item.content || '');
                    await this.storeArticleWithKeywords(feedId, item, keywords);
                }
            }
        })
    }

    private async storeArticleWithKeywords(feedId: number, item: Parser.Item, keywords: string[]): Promise<void> {
        const articleDate = new Date(item.pubDate || Date.now());
        const imageUrl = this.extractImageUrl(item);

        await this.prisma.$transaction(async (prisma) => {
            const existingArticle = await prisma.article.findUnique({
                where: { pageUrl: item.link || '' },
            });

            if (!existingArticle) {
                const newArticle = await prisma.article.create({
                    data: {
                        title: item.title || 'Untitled',
                        summary: item.contentSnippet || item.content || '',
                        source: item.link || 'Unknown',
                        date: articleDate,
                        pageUrl: item.link || '',
                        imageUrl: imageUrl,
                        feedId: feedId,
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
            remove_duplicates: true
        });
    }

    private extractImageUrl(item: ExtendedItem): string {
        if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
            return item.mediaContent.$.url;
        }

        if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
            return item.mediaThumbnail.$.url;
        }

        if (item.enclosure && item.enclosure?.type?.startsWith('image/') && item.enclosure.url) {
            return item.enclosure.url;
        }

        // Check for images embedded in description/content
        const content = item.content || item.contentSnippet || '';
        const imgRegex = /<img.*?src=["'](.*?)["']/;
        const imgMatch = content.match(imgRegex);
        if (imgMatch) {
            return imgMatch[1];
        }
        return '';
    }
}
export default RssParser;