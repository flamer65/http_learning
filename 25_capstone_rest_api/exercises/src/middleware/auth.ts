import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement JWT authentication middleware
  // 1. Check for Authorization header (Bearer token)
  // 2. Verify token using jsonwebtoken
  // 3. Attach payload to req.user
  // 4. Handle errors (401 Unauthorized)
  next(new AppError("Not implemented", 501));
};
