import express, { Request, Response } from 'express';
const router = express.Router();
import prisma from "../lib/prisma";
import authenticateOptional from "../middlewares/authenticateOptional";
import userService from "../services/userService";

interface ArticlesQueryParams {
    startDate?: string;
    endDate?: string;
    page?: string;
    pageSize?: string;
    keywords?: string;
    feedName?: string;
}

/**
 * @openapi
 * /articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Retrieve a list of articles
 *     parameters:
 *       - in: query
 *         name: keywords
 *         schema:
 *           type: string
 *         required: false
 *         description: Comma-separated list of keywords to filter articles
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for filtering articles
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for filtering articles
 *       - in: query
 *         name: feedName
 *         schema:
 *           type: string
 *         required: false
 *         description: Comma-separated list of feed names to filter articles
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: The page number of the articles to retrieve
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 9
 *         required: false
 *         description: The number of articles to retrieve per page
 *     responses:
 *       200:
 *         description: A paginated list of articles by descending date order, filtered by keywords, date range, and feed names. Includes only the feed name if available, along with pagination details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - articles
 *                 - totalArticles
 *               properties:
 *                 totalArticles:
 *                   type: integer
 *                   description: The total number of articles available.
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       summary:
 *                         type: string
 *                       pageUrl:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       feed:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 */

router.get('/', authenticateOptional, async (req: Request, res: Response) => {
    const queryParams = req.query as ArticlesQueryParams;
    const { startDate, endDate, page = '1', pageSize = '9', keywords, feedName } = queryParams;

    const pageNumber = parseInt(page as string, 10);
    const size = parseInt(pageSize as string, 10);
    const offset = (pageNumber - 1) * size;

    let queryConditions: any = {};

    // Logic for authenticated users
    if (req.body.userId) {
        if (!keywords && !startDate && !endDate && !feedName) {
            // User is logged in but no query parameters are provided
            const userKeywords = await userService.getUserKeywords(req.body.userId);
            if (userKeywords.length > 0) {
                queryConditions.keywords = {
                    some: {
                        Keyword: {
                            keyword: {
                                in: userKeywords
                            }
                        }
                    }
                };
            }
        } else {
            if (keywords) {
                const keywordsArray = keywords.split(',').map((k: string) => k.trim());
                queryConditions.keywords = {
                    some: {
                        Keyword: {
                            keyword: {
                                in: keywordsArray
                            }
                        }
                    }
                };
            }

            if (startDate) {
                queryConditions.date = { ...(queryConditions.date || {}), gte: new Date(startDate as string) };
            }

            if (endDate) {
                queryConditions.date = { ...(queryConditions.date || {}), lte: new Date(endDate as string) };
            }

            if (feedName) {
                const feedNames = feedName.split(',').map(fn => fn.trim());
                queryConditions.feed = {
                    name: {
                        in: feedNames
                    }
                };
            }
        }
    }

    try {
        const articles = await prisma.article.findMany({
            where: queryConditions,
            orderBy: { date: 'desc' }, // Assuming you want to order by date
            take: size,
            skip: offset
        });

        const totalArticles = await prisma.article.count({ where: queryConditions });

        res.json({ articles, totalArticles });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

/**
 * @openapi
 * /articles/{id}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: Retrieve a specific article by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the article
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detailed information about the article.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 source:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 pageUrl:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 feed:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *       404:
 *         description: Article not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', async (req: Request, res: Response) => {
    const articleId = parseInt(req.params.id);

    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: {
                id: true,
                title: true,
                summary: true,
                source: true,
                date: true,
                pageUrl: true,
                imageUrl: true,
                feed: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});
export default router;
