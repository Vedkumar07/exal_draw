import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface TokenPayload {
  userId: string;
  iat: number;
  exp?: number;
}

export default function (req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({ message: "No or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7); // remove "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (!decoded.userId) {
      res.status(403).json({ message: "Invalid token payload: userId missing" });
      return;
    }

    // Attach to request
    //@ts-ignore
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: "Unauthorized", error: err });
  }
}
