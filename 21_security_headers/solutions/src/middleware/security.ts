import { Request, Response, NextFunction } from "express";

export function manualSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  next();
}

export function hidePoweredBy(req: Request, res: Response, next: NextFunction) {
  res.removeHeader("X-Powered-By");
  next();
}
