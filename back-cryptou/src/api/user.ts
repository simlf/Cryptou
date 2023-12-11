import prisma from "../lib/prisma";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");
const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: get users [protected by authentication]
 */
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e: unknown) {
    console.error("error:", e);
    res.status(500);
    res.json({ e: "error:" });
  }
});

/**
 * @openapi
 * /users:
 *   post:
 *     summary: create new user
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, defaultCurrency, role, keywords, token } =
      req.body;
    const saltRounds = 3;
    const salt = await bcrypt.genSalt(saltRounds);
    // Hach password
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        defaultCurrency,
        role,
        keywords,
        token: generateToken(email),
      },
    });

    res.json(newUser);
    res.send("User registered successfully! ");
  } catch (e: any) {
    console.error("error :", e);
    res.status(500).json({
      error: "error",
      details: e.message,
    });
  }
});

// Function to generate JWT token
function generateToken(email: string): string {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  console.log("Secret utilisé pour signer le token :", secret);

  const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
  console.log("Token généré avec succès :", token);
  return token;
}

/**
 * @openapi
 * /login:
 *   post:
 *     summary: connect user
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(401).send("Email or password incorrect");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send("Email or password incorrect");
  }

  res.send("Connexion réussie!");
});

export default router;
