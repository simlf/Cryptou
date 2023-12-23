import prisma from "../lib/prisma";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");
const router = express.Router();
import authenticate from "../middlewares/authenticate";
import authorizeAdmin from "../middlewares/authorizeAdmin";
import UserService from "../services/userService";

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
router.get("/", authenticate, async (req: Request, res: Response) => {
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
 * /users/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Registers a new user
 *     description: Creates a new user with the provided information. It checks if the email is already in use and if the specified role is valid.
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
 *               - crypto
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user. Must be unique.
 *               password:
 *                 type: string
 *                 description: Password for the user account.
 *               defaultCurrency:
 *                 type: string
 *                 description: Default currency for the user.
 *               role:
 *                 type: integer
 *                 description: Role ID of the user in the system. Must be a valid existing role.
 *               keywords:
 *                 type: String
 *                 description: Keywords associated with the user.
 *               crypto:
 *                 type: String
 *                 description: Crypto associated with the user.
 *     responses:
 *       201:
 *         description: User registered successfully. Returns the created user data.
 *       400:
 *         description: Bad request. Invalid role specified.
 *       409:
 *         description: Conflict. Email already in use.
 *       500:
 *         description: Internal server error due to an issue in user creation.
 */
router.post("/register", async (req: Request, res: Response) => {
  console.log("req.body:", req.body);
  try {
    const { email, password, defaultCurrency, role, keywords, crypto } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).send("Email already in use");
    }

    const roleExists = await prisma.role.findUnique({
      where: { id: role },
    });

    if (!roleExists) {
      return res.status(400).send("Invalid role specified");
    }

    const saltRounds = 3;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email, roleExists.role);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        defaultCurrency,
        role,
        keywords,
        crypto,
        token: token,
      },
    });

    res.send(JSON.stringify({
      email: email,
      keywords: keywords,
      crypto: crypto,
      role: role,
      currency: defaultCurrency,
      token: token,
    })); // 201 Created
  } catch (e) {
    console.error("Registration error:", e);

    // Type assertion to handle the error object
    const error = e as Error;

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Function to generate JWT token for an admin or a user
function generateToken(email: string, role: string): string {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  const token = jwt.sign({ email, role }, secret, { expiresIn: "1h" });
  return token;
}

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Logs in a user
 *     description: Authenticates a user with the provided email and password and generates a new authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *     responses:
 *       200:
 *         description: Successful login. Returns a new authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized - Email or password incorrect
 *       500:
 *         description: Internal server error due to an issue in the login process
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return res.status(401).send("Email or password incorrect");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Email or password incorrect");
    }
    const newToken = generateToken(user.email, user.role.toString());
    await prisma.user.update({
      where: { email: email },
      data: { token: newToken },
    });
    res.send(JSON.stringify({
      email: user.email,
      keywords: user.keywords,
      crypto: user.crypto,
      role: user.role,
      currency: user.defaultCurrency,
      token: newToken,
    }));
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred during login");
  }
});

/**
 * @openapi
 * /users/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User Profile
 *     description: Retrieves the profile of a user based on their authorization token. The request must include an authorization token in the header
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Authorization token of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - No token provided or token is invalid.
 *       404:
 *         description: Not found - User not found for the provided token.
 *       500:
 *         description: Internal server error
 */

router.get("/profile", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserByEmail(req.body.userId.email);

    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal server error");
  }
});

/**
 * @openapi
 * /users/profile:
 *   put:
 *     tags:
 *       - User
 *     summary: Update User Email, Default Currency, and Keywords
 *     description: Updates the email, default currency, and keywords of a user's profile. Requires an authorization token in the header.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: New email of the user. Required if changing email.
 *               defaultCurrency:
 *                 type: string
 *                 description: New default currency for the user. Required if changing default currency.
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of new keywords associated with the user. Optional.
 *     responses:
 *       200:
 *         description: User profile updated successfully. Returns the updated user data with new email, default currency, and keywords.
 *       400:
 *         description: Bad request. Invalid input parameters.
 *       401:
 *         description: Unauthorized - No token provided or token is invalid.
 *       404:
 *         description: Not found - User not found or unable to update.
 *       500:
 *         description: Internal server error due to an issue in updating the user profile.
 */
router.put("/profile", authenticate, async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    const updatedUser = await UserService.updateUser(
      req.body.userId.email,
      updateData
    );

    if (!updatedUser) {
      return res.status(404).send("User not found or unable to update");
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send("Internal server error");
  }
});

export default router;
