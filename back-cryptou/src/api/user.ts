const express = require("express");
import prisma from "../lib/prisma";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middlewares/auth";
const router = express.Router();

// get users (protected by authentication)
router.get("/users", authenticateToken, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    console.error("error:", e);
    res.status(500);
    res.json({ e: "error:" });
  }
});

// create new user

router.post("/users", async (req: Request, res: Response) => {
  try {
    const { email, password, defaultCurrency, role, keywords, token } =
      req.body;

    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        defaultCurrency,
        role,
        keywords,
        token: generateToken(email),
      },
    });

    console.log("👏 :", newUser);
    res.json(newUser);
  } catch (e: any) {
    console.error("❌ :", e);
    res.status(500).json({
      error: "❌",
      details: e.message,
    });
  }
});

// Fonction pour générer un token JWT
function generateToken(email: string): string {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  console.log("Secret utilisé pour signer le token :", secret);

  const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
  console.log("Token généré avec succès :", token);
  return token;
}

export default router;
