import { Request, Response, NextFunction } from "express";

// A simple in-memory rate limiter for demonstration purposes
// In production, you would use `express-rate-limit` with a Redis store!

export const requestCounts = new Map<string, number>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || "unknown";
  
  // TODO: Implement rate limiting logic
  // 1. Get the current count for this IP
  // 2. If count >= 3, return 429 { error: "Too many requests" }
  // 3. Otherwise, increment count and call next()
  const count = requestCounts.get(ip) || 0;
  if (count >= 3) {
    return res.status(429).json({ error: "Too many requests" });
  } else {
    requestCounts.set(ip, count + 1);
  }
  // Note: For this simple test, we won't implement time-based expiration,
  // but a real rate limiter resets the count every X minutes.

  next();
}
