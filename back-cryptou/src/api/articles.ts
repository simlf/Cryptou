import express, { Request, Response } from 'express';
const router = express.Router();
import prisma from "../lib/prisma";

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
router.get('/articles', async (req: Request, res: Response) => {
    const { startDate, endDate, page = '1', pageSize = '9' } = req.query;

    const pageNumber = parseInt(String(page), 10);
    const size = parseInt(String(pageSize), 10);
    const offset = (pageNumber - 1) * size;

    let keywords: string[] = [];
    let feedNames: string[] = [];

    if (typeof req.query.keywords === 'string') {
        keywords = req.query.keywords.split(',').map(k => k.trim());
    }

    if (typeof req.query.feedName === 'string') {
        feedNames = req.query.feedName.split(',').map(fn => fn.trim());
    }

    let queryConditions: any = {};

    if (startDate && typeof startDate === 'string') {
        queryConditions.date = { ...(queryConditions.date || {}), gte: new Date(startDate) };
    }

    if (endDate && typeof endDate === 'string') {
        queryConditions.date = { ...(queryConditions.date || {}), lte: new Date(endDate) };
    }

    try {
        const articles = await prisma.article.findMany({
            where: {
                ...queryConditions,
                ...(keywords.length > 0 ? {
                    keywords: {
                        some: {
                            Keyword: {
                                keyword: {
                                    in: keywords
                                }
                            }
                        }
                    }
                } : {}),
                ...(feedNames.length > 0 ? {
                    feed: {
                        name: {
                            in: feedNames
                        }
                    }
                } : {})
            },
            select: {
                id: true,
                title: true,
                pageUrl: true,
                imageUrl: true,
                feed: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { date: 'desc' },
            take: size,
            skip: offset
        });

        // Counting the total articles
        const totalArticles = await prisma.article.count({
            where: {
                ...queryConditions,
                ...(keywords.length > 0 ? {
                    keywords: {
                        some: {
                            Keyword: {
                                keyword: {
                                    in: keywords
                                }
                            }
                        }
                    }
                } : {}),
                ...(feedNames.length > 0 ? {
                    feed: {
                        name: {
                            in: feedNames
                        }
                    }
                } : {})
            },
        });
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
router.get('/articles/:id', async (req: Request, res: Response) => {
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
