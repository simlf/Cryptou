import express, { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CryptoFetcher } from "../crypto/cryptoFetcher";
import {CryptoChartData, CryptoData, CryptoDataSql} from "../types/cryptoInterface";
import authenticate from "../middlewares/authenticate";
import authorizeAdmin from "../middlewares/authorizeAdmin";

const router = express.Router();

/**
 * @swagger
 * /cryptos:
 *   get:
 *     summary: Get cryptocurrencies list or by ID
 *     description: Get cryptocurrencies with the specified ID(s) if they exist. If no IDs are provided, return a list of all cryptocurrencies.
 *     parameters:
 *       - in: query
 *         name: cmids
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: An optional array of cryptocurrency IDs
 *     responses:
 *       '200':
 *         description: Cryptocurrencies found
 *         content:
 *           application/json:
 *             example:
 *               - fullName: Bitcoin
 *                 slugName: BTC
 *                 currentPrice: 10000
 *                 openingPrice: 9000
 *                 lowestPrice: 8000
 *                 highestPrice: 11000
 *                 imageUrl: https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579
 *       '404':
 *         description: Cryptocurrencies not found
 *         content:
 *           application/json:
 *             example:
 *               error: Cryptocurrencies not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Something went wrong
 *     tags:
 *       - Cryptocurrencies
 */

router.get("/cryptos", async (req: Request, res: Response): Promise<void> => {
    console.debug("GET /cryptos")
  const { cmids } = req.query;
  const cryptoListInfo: CryptoData[] = [];
  try {
    if (cmids) {
      const cryptoIds = Array.isArray(cmids) ? cmids.map(Number) : [Number(cmids)];
      const crypto: CryptoDataSql[] = await prisma.cryptocurrency.findMany({
        where: {
          id: {
            in: cryptoIds,
          },
        },
      });
      if (crypto !== null) {
        for (let i = 0; i < crypto.length; i++) {
          const cryptoInfo = await CryptoFetcher.getCryptoGenralInfo(crypto[i], "EUR");
          cryptoListInfo.push(cryptoInfo);
        }
        res.status(200).json(cryptoListInfo);
      } else {
        const cryptoList: CryptoDataSql[] = await getAllCrypto();
        res.status(404).json({ error: "Cryptocurrencies not found", suggestedList: cryptoList });
      }
    } else {
      const cryptoList: CryptoDataSql[] = await getAllCrypto();
      for (let i = 0; i < cryptoList.length; i++) {
        const cryptoInfo = await CryptoFetcher.getCryptoGenralInfo(cryptoList[i], "EUR");
        cryptoListInfo.push(cryptoInfo);
      }
      res.status(200).json(cryptoListInfo);
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /cryptos/{id}:
 *   get:
 *     summary: Get cryptocurrency by ID
 *     description: Get the cryptocurrency with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cryptocurrency to retrieve.
 *     responses:
 *       '200':
 *         description: Cryptocurrency found
 *         content:
 *           application/json:
 *             example:
 *               fullName: Bitcoin
 *               slugName: BTC
 *               currentPrice: 10000
 *               openingPrice: 9000
 *               lowestPrice: 8000
 *               highestPrice: 11000
 *               imageUrl: https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579
 *       '404':
 *         description: Cryptocurrency not found
 *         content:
 *           application/json:
 *             example:
 *               error: Cryptocurrency not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Something went wrong
 *     tags:
 *       - Cryptocurrencies
 */
router.get("/cryptos/:id", authenticate, async (req: Request, res: Response): Promise<void> => {
  const cryptoId = parseInt(req.params.id);
  try {
    const crypto: CryptoDataSql | null = await prisma.cryptocurrency.findUnique({
      where: { id: cryptoId },
    });
    if (crypto !== null) {
      const cryptoInfo = await CryptoFetcher.getCryptoGenralInfo(crypto, "EUR");
      res.status(200).json(cryptoInfo);
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @openapi
 * /cryptos/{cmid}/history/{period}:
 *   get:
 *     summary: Get historical price data for a cryptocurrency.
 *     description: Get historical price data for a cryptocurrency based on the specified period.
 *     parameters:
 *       - in: path
 *         name: cmid
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the cryptocurrency.
 *       - in: path
 *         name: period
 *         schema:
 *           type: string
 *         enum: [daily, hourly, minute]
 *         required: true
 *         description: The period for which historical data is requested (daily, hourly, or minute).
 *     responses:
 *       '200':
 *         description: Historical price data for the cryptocurrency.
 *         content:
 *           application/json:
 *             example:
 *               - time: 1639075200
 *                 high: 60000
 *                 low: 55000
 *                 open: 57000
 *                 volumefrom: 1000
 *                 volumeto: 55000
 *                 close: 58000
 *                 conversionType: direct
 *                 conversionSymbol: EUR
 *       '404':
 *         description: Cryptocurrency not found.
 *         content:
 *           application/json:
 *             example:
 *               error: Cryptocurrency not found
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               error: Something went wrong
 *     tags:
 *       - Cryptocurrencies
 *
 * @function
 * @async
 * @name getCryptoHistory
 * @memberof module:routes/cryptocurrency
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete
 */
router.get("/cryptos/:cmid/history/:period", authenticate, async (req: Request, res: Response): Promise<void> => {
  const cryptoId = parseInt(req.params.cmid);
  const period = req.params.period;

  try {
    const crypto: CryptoDataSql | null = await prisma.cryptocurrency.findUnique({
      where: { id: cryptoId },
    });

    if (crypto !== null) {
      // Default to "daily" if period is not specified or invalid
      const validPeriods = ["daily", "hourly", "minute"];
      const selectedPeriod = validPeriods.includes(period) ? period : "daily";

      const cryptoInfo: CryptoChartData[] = await CryptoFetcher.getCryptoPriceInfo(crypto, "EUR", selectedPeriod);
      res.status(200).json(cryptoInfo);
    } else {
      res.status(404).json({ error: "Cryptocurrency not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /cryptos/graph:
 *   get:
 *     summary: Retrieve a cryptocurrency graph data
 *     description: Retrieve cryptocurrency graph data based on the provided query parameters.
 *     parameters:
 *       - in: query
 *         name: cmid
 *         schema:
 *           type: integer
 *         description: The id of the cryptocurrency
 *       - in: query
 *         name: unit
 *         schema:
 *           type: string
 *         description: The time unit for the graph data
 *       - in: query
 *         name: min
 *         schema:
 *           type: integer
 *         description: The minimum time for the graph data
 *       - in: query
 *         name: max
 *         schema:
 *           type: integer
 *         description: The maximum time for the graph data
 *     responses:
 *       200:
 *         description: A list of cryptocurrency graph data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CryptoData'
 *       404:
 *         description: Cryptocurrency not found
 *       500:
 *         description: Something went wrong
 */
router.get("/cryptos/graph/:cmid/:unit/:min/:max", async (req: Request, res: Response): Promise<void> => {
    const cryptoId: number = parseInt(req.params.cmid);
    const unit: string = req.params.unit;
    const max: number = parseInt(req.params.max);
    const min: number = parseInt(req.params.min);

    if (!['day', 'hour', 'minute'].includes(unit)) {
        res.status(400).json({ error: "Invalid unit. It can only be 'day', 'hour', or 'minute'." });
        return;
    }

    try {
        const crypto: CryptoDataSql | null = await prisma.cryptocurrency.findUnique({
          where: { id: cryptoId },
        });

        if (crypto !== null) {
          const cryptoInfo: CryptoChartData[] = await CryptoFetcher.getCryptoGraphData(crypto.slugName, "EUR", max, min, unit);
          res.status(200).json(cryptoInfo);
        } else {
          res.status(404).json({ error: "Cryptocurrency not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

/**
 * @openapi
 * /cryptos/{cmid}:
 *   delete:
 *     summary: Delete a cryptocurrency by ID.
 *     description: Delete a cryptocurrency with the specified ID.
 *     parameters:
 *       - in: path
 *         name: cmid
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the cryptocurrency to be deleted.
 *     responses:
 *       '200':
 *         description: Cryptocurrency successfully deleted.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: Bitcoin
 *               symbol: BTC
 *               imageUrl: https://example.com/bitcoin.png
 *               deleted: true
 *       '404':
 *         description: Cryptocurrency not found.
 *         content:
 *           application/json:
 *             example:
 *               error: Cryptocurrency not found
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               error: Something went wrong
 *     tags:
 *       - Cryptocurrencies
 *
 * @function
 * @async
 * @name deleteCryptoById
 * @memberof module:routes/cryptocurrency
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete
 */
router.delete("/cryptos/:cmid", authorizeAdmin, async (req: Request, res: Response): Promise<void> => {
    const cryptoId = parseInt(req.params.cmid);
    try {
      const response = await prisma.cryptocurrency.delete({
        where: { id: cryptoId },
      });
      if (crypto !== null) {
          res.status(200).json(response);
        } else {
          res.status(404).json({ error: "Cryptocurrency not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

/**
 * @openapi
 * /cryptos:
 *   post:
 *     summary: Create a new cryptocurrency.
 *     description: Create a new cryptocurrency with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the cryptocurrency.
 *               slugName:
 *                 type: string
 *                 description: The slug name or symbol of the cryptocurrency.
 *               imageUrl:
 *                 type: string
 *                 description: The URL of the image for the cryptocurrency.
 *             required:
 *               - fullName
 *               - slugName
 *               - imageUrl
 *     responses:
 *       '200':
 *         description: Cryptocurrency successfully created.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               fullName: Bitcoin
 *               slugName: BTC
 *               imageUrl: https://example.com/bitcoin.png
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               error: Something went wrong
 *     tags:
 *       - Cryptocurrencies
 *
 * @function
 * @async
 * @name createCrypto
 * @memberof module:routes/cryptocurrency
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete
 */
router.post("/cryptos", authorizeAdmin,async (req: Request, res: Response): Promise<void> => {
    const { fullName, slugName, imageUrl } = req.body;
    console.log(req.body);
    try {
        const response = await prisma.cryptocurrency.create({
        data: {
            fullName,
            slugName,
            imageUrl,
        },
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

async function getAllCrypto(): Promise<CryptoDataSql[]> {
  try {
    const cryptoList: CryptoDataSql[] = await prisma.cryptocurrency.findMany();
    return cryptoList;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default router;
