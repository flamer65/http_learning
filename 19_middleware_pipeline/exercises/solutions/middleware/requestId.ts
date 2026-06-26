import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = crypto.randomUUID();
  res.setHeader("X-Request-Id", id);
  next();
};
