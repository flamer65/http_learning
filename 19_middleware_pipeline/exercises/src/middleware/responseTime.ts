import { Request, Response, NextFunction } from "express";

export const responseTime = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Record the start time using performance.now() or Date.now()
  // TODO: Add a listener to res.on("finish", ...) to calculate duration
  // TODO: Set the "X-Response-Time" header with the duration (e.g., "5ms")
  // TODO: Call next()
  const start = performance.now();
  
  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    const duration = performance.now() - start;
    res.setHeader("X-Response-Time", `${duration.toFixed(2)}ms`);
    return originalEnd.apply(this, args as any);
  };
  next();
};
