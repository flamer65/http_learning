import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const cacheControl = (maxAge: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement Cache-Control header for GET requests
    next();
  };
};

export const etagMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement ETag generation and 304 Not Modified logic
  next();
};
