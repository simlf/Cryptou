import {PrismaClient} from "@prisma/client";
import RssParser from "./rssParser";
import FeedFetcher from "./feedFetcher";

class FeedValidatorService {
    private feedFetcher: FeedFetcher;
    private rssParser: RssParser;

    constructor() {
        this.feedFetcher = new FeedFetcher();
        this.rssParser = new RssParser();
    }


    public async isValidFeed(url: string): Promise<boolean> {
        try {
            const feedContent = await this.feedFetcher.fetchFeed(url);
            return await this.rssParser.canParseFeed(feedContent);
        } catch (error) {
            console.error(`Error validating feed URL: ${url}`, error);
            return false;
        }
    }
}

export default FeedValidatorService;
