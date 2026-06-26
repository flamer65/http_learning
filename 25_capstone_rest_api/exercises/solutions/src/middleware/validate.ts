import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") {
        return next(new AppError(\`Missing required field: \${field}\`, 400));
      }
    }
    next();
  };
};
