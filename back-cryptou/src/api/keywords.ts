import express, { Request, Response } from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the keyword.
 *                   name:
 *                     type: string
 *                     description: The name of the keyword.
 *                   url:
 *                     type: string
 *                     description: A URL to more information about the keyword, possibly to a related search or filter.
 *                   lastFetched:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of when the keyword was last fetched from the source.
 *                   lastArticleDate:
 *                     type: string
 *                     format: date-time
 *                     description: The date of the most recent article associated with this keyword.
 *         examples:
 *           application/json:
 *             - id: 1
 *               name: "Blockchain"
 *               url: "https://example.com/keywords/blockchain"
 *               lastFetched: "2023-04-05T08:40:51.620Z"
 *               lastArticleDate: "2023-04-04T11:25:47.200Z"
 *             - id: 2
 *               name: "Bitcoin"
 *               url: "https://example.com/keywords/bitcoin"
 *               lastFetched: "2023-04-05T09:20:33.000Z"
 *               lastArticleDate: "2023-04-05T06:15:29.000Z"
 */
router.get('/keywords', async (req: Request, res: Response) => {
    try {
        const keywords = await prisma.keyword.findMany(
            {
                select: {
                    keyword: true,
                },
            },
        );
        res.json(keywords);
    } catch (error: unknown) {
        res.status(500).json({ error: 'An error occurred while fetching keywords' });
    }
});
export default router;