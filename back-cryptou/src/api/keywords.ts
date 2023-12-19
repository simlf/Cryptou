import express, { Request, Response } from 'express';
import prisma from "../lib/prisma";
const router = express.Router();

/**
 * @openapi
 * /keywords:
 *   get:
 *     tags:
 *       - Keywords
 *     summary: Get all keywords
 *     description: Retrieve a list of keywords used for filtering articles. Each keyword includes metadata such as the last time it was fetched and the date of the last article associated with it.
 *     responses:
 *       200:
 *         description: List of all keywords with their metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   keyword:
 *                    type: string
 *                    description: The keyword used for filtering articles.
 */
router.get('/keywords', async (req: Request, res: Response) => {
    try {
        const keywords = await prisma.keyword.findMany({
            select: {
                keyword: true,
                // Optionally select other fields you need, but exclude the _count
            },
            orderBy: {
                ArticleKeyword: {
                    _count: 'desc'
                }
            }
        });

        res.json(keywords);
    } catch (error: unknown) {
        res.status(500).json({ error: 'An error occurred while fetching keywords' });
    }
});

export default router;