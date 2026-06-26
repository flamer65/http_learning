import { Request, Response, NextFunction } from "express";
import { AppError } from "../../src/utils/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code
    });
  }

  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR"
  });
};
