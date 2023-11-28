import express, { Request, Response } from "express";
import prisma from "../lib/prisma";

const router = express.Router();

// get list of all the cryptos in db
router.get("/cryptoList", async (req: Request, res: Response) => {
  try {
    const cryptoList = await prisma.cryptocurrency.findMany();
    res.json(cryptoList);
  } catch (error) {
    res.json({ error: "Something went wrong" });
  }
});

export default router;
