// EN COURS DE DEV

// import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { getUserByEmail } from "../lib/prisma";

// export const authenticateToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET || "hGt0SYKITXecFbHOhYvt5xBu" // ajouter une variable d'environnement dans le .env : JWT_SECRET
//     ) as JwtPayload;

//     const user = await getUserByEmail(decoded.email);
//     req.user = user?.email ?? undefined;

//     next();
//   } catch (error) {
//     console.error("Erreur de vérification du token :", error);
//     res.status(401).json({ error: "Forbidden: Invalid token" });
//   }
// };
