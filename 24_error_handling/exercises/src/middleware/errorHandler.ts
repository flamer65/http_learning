import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

// TODO: Implement the error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Log the full error to the console (including stack trace)
  console.error(err);

  // 2. Check if the error is an instance of AppError
  // If it is, use its statusCode, code, and message for the response
  if (err instanceof AppError) {
    // TODO: return res.status(...).json(...)
    return res.status(err.statusCode).json({ error: err.message, code: err.code });
  }

  // 3. If it's an unexpected error, return 500
  res.status(500).json({ error: "Internal server error", code: "INTERNAL_ERROR" });
  // Do NOT expose the stack trace to the client!

};
