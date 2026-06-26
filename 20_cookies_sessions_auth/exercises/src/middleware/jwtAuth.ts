import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../routes/jwtAuth";

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Extract token from Authorization header ("Bearer <token>")
  const authHeader = req.headers.authorization as string;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }
  const token = authHeader.substring(7); // Remove "Bearer " prefix
  // TODO: If no token -> 401
  // TODO: Verify token using jwt.verify().
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if(err) {
        res.status(401).json({ message: "Invalid token" });
      }
      req.user = payload;
      next();
    }); 
  // TODO: If valid, attach payload to req.user and next(). If invalid -> 401
};

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
