import express, { Request, Response } from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @openapi
 * /feeds:
 *   post:
 *     summary: Create a new feed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feed created successfully
 *       400:
 *         description: Bad request
 */
router.post('/feeds', async (req: Request, res: Response) => {
    const { name, url } = req.body;

    try {
        const newFeed = await prisma.feed.create({
            data: { name, url },
        });
        res.status(201).json(newFeed);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
});

/**
 * @openapi
 * /feeds:
 *   get:
 *     summary: Get all feeds
 *     responses:
 *       200:
 *         description: List of all feeds
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
router.get('/feeds', async (req: Request, res: Response) => {
    try {
        const feeds = await prisma.feed.findMany();
        res.json(feeds);
    } catch (error: unknown) {
        res.status(500).json({ error: 'An error occurred while fetching feeds' });
    }
});

/**
 * @openapi
 * /feeds/{id}:
 *   put:
 *     summary: Update a feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the feed
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feed updated successfully
 *       404:
 *         description: Feed not found
 */
router.put('/feeds/:id', async (req: Request, res: Response) => {
    const feedId = parseInt(req.params.id);
    const { name, url } = req.body;

    try {
        const updatedFeed = await prisma.feed.update({
            where: { id: feedId },
            data: { name, url },
        });
        res.json(updatedFeed);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(404).json({ error: 'Feed not found' });
        }
    }
});

/**
 * @openapi
 * /feeds/{id}:
 *   delete:
 *     summary: Delete a feed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the feed
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feed deleted successfully
 *       404:
 *         description: Feed not found
 */
router.delete('/feeds/:id', async (req: Request, res: Response) => {
    const feedId = parseInt(req.params.id);

    try {
        await prisma.feed.delete({
            where: { id: feedId },
        });
        res.status(200).json({ message: 'Feed deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(404).json({ error: 'Feed not found' });
        }
    }
});

export default router;
