import { Request, Response, NextFunction } from "express";

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Generate a simple UUID or random string
  // TODO: Set "X-Request-Id" header on the response
  // TODO: Call next()
  const requestId = Math.random().toString(36).substring(2, 15);
  res.setHeader("X-Request-Id", requestId);
  next();
};
