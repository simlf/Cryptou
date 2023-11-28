import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../lib/prisma";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    const user = await getUserByEmail(decoded.email);
    req.user = user;

    next();
  } catch (error) {
    console.error("Erreur de vérification du token :", error);
    res.status(401).json({ error: "Token invalide" });
  }
};
