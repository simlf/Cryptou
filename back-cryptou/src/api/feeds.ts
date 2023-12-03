import express, { Request, Response } from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import FeedValidatorService from "../rss/feedValidatorService";

const prisma = new PrismaClient();

/**
 * @openapi
 * /feeds:
 *   post:
 *     tags:
 *       - Feeds
 *     summary: Create a new feed
 *     description: Adds a new RSS feed to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the feed.
 *               url:
 *                 type: string
 *                 description: URL of the feed.
 *     responses:
 *       201:
 *         description: Feed created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created feed.
 *                 name:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Bad request - Invalid RSS feed URL or other client error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       409:
 *         description: Conflict - A feed with the same name or URL already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/feeds', async (req: Request, res: Response) => {
    const { name, url } = req.body;

    try {
        const existingFeed = await prisma.feed.findFirst({
            where: {
                OR: [
                    { name },
                    { url }
                ],
            },
        });

        if (existingFeed) {
            return res.status(409).json({ error: 'A feed with the same name or URL already exists' });
        }

        if (!(await new FeedValidatorService().isValidFeed(url))) {
            return res.status(400).json({ error: 'Invalid RSS feed URL' });
        }

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
 *     tags:
 *       - Feeds
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
 *     tags:
 *       - Feeds
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
 *     tags:
 *       - Feeds
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
