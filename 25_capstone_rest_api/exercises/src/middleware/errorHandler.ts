import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement centralized error handling
  // If err is instance of AppError, use its statusCode
  // Otherwise return 500
  res.status(500).json({ error: "Not implemented" });
};
