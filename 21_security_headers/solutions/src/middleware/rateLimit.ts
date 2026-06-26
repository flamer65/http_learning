import { Request, Response, NextFunction } from "express";

export const requestCounts = new Map<string, number>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || "unknown";
  
  const count = requestCounts.get(ip) || 0;
  
  if (count >= 3) {
    res.status(429).json({ error: "Too many requests" });
    return;
  }
  
  requestCounts.set(ip, count + 1);
  next();
}
