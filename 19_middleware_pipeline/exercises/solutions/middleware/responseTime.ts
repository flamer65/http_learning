import { Request, Response, NextFunction } from "express";

export const responseTime = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  res.on("finish", () => {
    const duration = performance.now() - start;
    res.setHeader("X-Response-Time", `${duration}ms`);
  });
  next();
};
