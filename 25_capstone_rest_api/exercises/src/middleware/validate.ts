import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Validate that all required fields exist in req.body
    next();
  };
};
