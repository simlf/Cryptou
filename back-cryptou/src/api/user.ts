import prisma from "../lib/prisma";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");
const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieves a list of users
 *     description: This endpoint is protected and requires authentication. It returns a list of all registered users.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
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
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: Registers a new user
 *     description: Creates a new user with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - defaultCurrency
 *               - role
 *               - keywords
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *               defaultCurrency:
 *                 type: string
 *                 description: Default currency for the user
 *               role:
 *                 type: string
 *                 description: Role of the user in the system
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Keywords associated with the user
 *     responses:
 *       200:
 *         description: User registered successfully
 *       500:
 *         description: Internal server error due to an issue in user creation
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
 *     tags:
 *       - User
 *     summary: Logs in a user
 *     description: Authenticates a user with the provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized - Email or password incorrect
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
