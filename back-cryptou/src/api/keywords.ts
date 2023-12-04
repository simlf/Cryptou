import express, { Request, Response } from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @openapi
 * /keywords:
 *   get:
 *     summary: Get all keywords
 *     responses:
 *       200:
 *         description: List of all keywords
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   url:
 *                     type: string
 *                   lastFetched:
 *                     type: string
 *                     format: date-time
 *                   lastArticleDate:
 *                     type: string
 *                     format: date-time
 */
router.get('/keywords', async (req: Request, res: Response) => {
    try {
        const keywords = await prisma.keywords.findMany();
        res.json(keywords);
    } catch (error: unknown) {
        res.status(500).json({ error: 'An error occurred while fetching keywords' });
    }
});

export default router;
