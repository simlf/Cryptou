import Parser, {Item} from 'rss-parser';
import keywordExtractor from 'keyword-extractor';
import { LanguageName } from "keyword-extractor/types/lib/keyword_extractor";
import prisma from "../lib/prisma";

interface MediaContent {
    $: {
        url: string;
        type?: string;
        height?: string;
        width?: string;
    };
    encoded?: string;
}

interface ExtendedItem extends Item {
    mediaContent?: MediaContent;
    mediaThumbnail?: MediaContent;
    contentEncoded?: string;
}

class RssParser {
    private parser: Parser<ExtendedItem>;

    constructor() {
        this.parser = new Parser({
            customFields: {
                item: [
                    ['media:content', 'mediaContent'],
                    ['media:thumbnail', 'mediaThumbnail'],
                    ['content:encoded', 'contentEncoded']
                ]
            }
        });
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

    public async parseAndStore(feedId: number, feedContent: string, lastArticleDate: Date, languageName: string): Promise<void> {
        await this.parser.parseString(feedContent, async (err, feed) => {
            if (err) {
                console.error(err);
                return;
            }
            for (const item of feed.items) {
                const articleDate = new Date(item.pubDate || Date.now());
                if (!lastArticleDate || articleDate > lastArticleDate) {
                    const keywords = this.extractKeywords(item.contentSnippet || item.content || '', languageName);
                    await this.storeArticleWithKeywords(feedId, item, keywords);
                }
            }
        })
    }

    private async storeArticleWithKeywords(feedId: number, item: Parser.Item, keywords: string[]): Promise<void> {
        const articleDate = new Date(item.pubDate || Date.now());
        const imageUrl = this.extractImageUrl(item);

        await prisma.$transaction(async (prisma: any) => {
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
            }
            // ELSE the article already exists, so do nothing
        });
    }

    private extractKeywords(content: string, languageName: string): string[] {
        const language = languageName as LanguageName;

        return keywordExtractor.extract(content, {
            language: language,
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

        // Check for images embedded in content:encoded, content, or contentSnippet
        let content: string = '';

        // If content:encoded is a string, use it directly
        if (typeof item.contentEncoded === 'string') {
            content = item.contentEncoded;
        } else if (item.content && typeof item.content === 'string') {
            // If 'content' is a string, use it
            content = item.content;
        } else if (item.contentSnippet && typeof item.contentSnippet === 'string') {
            // If 'contentSnippet' is a string, use it
            content = item.contentSnippet;
        }

        // Use a regex to extract the image URL from the content
        const imgRegex = /<img.*?src=["'](.*?)["']/;
        const imgMatch = content.match(imgRegex);
        if (imgMatch && imgMatch[1]) {
            return imgMatch[1];
        }
        return '';
    }
}
export default RssParser;