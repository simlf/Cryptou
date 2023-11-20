const express = require("express");
import prisma from "../lib/prisma";
import { Request, Response } from "express";
// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middlewares/auth";
const router = express.Router();

// get users (protected by authentication)
// router.get("/users", authenticateToken, async (req: Request, res: Response) => {
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    console.error("error:", e);
    res.status(500);
    res.json({ e: "error:" });
  }
});

//JWT
router.get("/jwt", async (req: Request, res: Response) => {
  // try {
  res.json({ token: true });
  // } catch (e) {
  //   console.error("error:", e);
  //   res.status(500);
  //   res.json({ e: "error:" });
  // }
});

// create new user
router.post("/users", async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      defaultCurrency,
      role,
      keywords,
      token = generateToken(email),
    } = req.body;
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        defaultCurrency,
        role,
        keywords,
        token: token,
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

// Function to generate a JWT token
function generateToken(payload: any) {
  // const secret = process.env.JWT_SECRET || "hGt0SYKITXecFbHOhYvt5xBu";
  const secret = "hGt0SYKITXecFbHOhYvt5xBu";
  const token = jwt.sign({ email: payload }, secret, { expiresIn: "1h" });
  return token;
}

export default router;
