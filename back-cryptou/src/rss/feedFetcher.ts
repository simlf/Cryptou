import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import RssParser from "./rssParser";

class FeedFetcher {
    private prisma: PrismaClient;
    private parser: RssParser;

    constructor() {
        this.prisma = new PrismaClient();
        this.parser = new RssParser();
    }

    public async fetchAllFeeds(): Promise<void> {
        console.log('Running scheduled feed fetching...');

        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const feeds = await this.prisma.feed.findMany({
            select: { id: true, url: true, lastFetched: true, lastArticleDate: true }
        });

        for (const feed of feeds) {
            if (!feed.lastFetched || feed.lastFetched < tenMinutesAgo) {
                const feedContent = await this.fetchFeed(feed.url);

                // Handle the potential null value for lastArticleDate
                const lastArticleDate = feed.lastArticleDate ? new Date(feed.lastArticleDate) : new Date(0);

                await this.parser.parseAndStore(feed.id, feedContent, lastArticleDate);

                await this.prisma.feed.update({
                    where: { id: feed.id },
                    data: { lastFetched: new Date() },
                });
            } else {
                console.log(`Skipping feed ${feed.url} - fetched less than 10 minutes ago.`);
            }
        }
    }

    public async fetchFeed(url: string): Promise<string> {
        try {
            return (await axios.get(url)).data;
        } catch (error) {
            throw error instanceof Error ? error : new Error('An unknown error occurred while fetching the feed');
        }
    }
}

export default FeedFetcher;