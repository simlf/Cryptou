import express, { Request, Response } from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @openapi
 * /articles:
 *   get:
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
 *         description: Name of the feed to filter articles
 *     responses:
 *       200:
 *         description: A list of articles by descending date order filtered by keywords, date range, and feed name. If no filters are provided, all articles are returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   pageUrl:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 */
router.get('/articles', async (req: Request, res: Response) => {
    const { feedName, startDate, endDate } = req.query;
    let keywords: string[] = [];

    if (typeof req.query.keywords === 'string') {
        keywords = req.query.keywords.split(',').map(k => k.trim());
    }

    let queryConditions: any = {};

    if (feedName && typeof feedName === 'string') {
        queryConditions.feed = { name: feedName };
    }

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
                } : {})
            },
            include: {
                feed: true,
            },
            orderBy: { date: 'desc' }
        });
        res.json(articles);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});


// GET /articles/{id} - Fetch specific article by ID
router.get('/articles/:id', async (req, res) => {
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
                imageUrl: true
            }
        });

        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({error: error.message});
        } else {
            res.status(500).json({error: 'An unknown error occurred'});
        }
    }
});

export default router;
