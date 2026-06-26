import { Request, Response, NextFunction } from "express";

export function manualSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // TODO: Set the following headers:
  // - Strict-Transport-Security: max-age=31536000; includeSubDomains
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  // - X-Content-Type-Options: nosniff
  res.setHeader("X-Content-Type-Options", "nosniff");

  // - X-Frame-Options: DENY
  res.setHeader("X-Frame-Options", "DENY");
  // - Content-Security-Policy: default-src 'self'
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  // - Referrer-Policy: strict-origin-when-cross-origin
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // - Permissions-Policy: camera=(), microphone=(), geolocation=(self)
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");    
  // - X-Frame-Options: DENY
  res.setHeader("X-Frame-Options", "DENY");
  // - Content-Security-Policy: default-src 'self'
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  // - Referrer-Policy: strict-origin-when-cross-origin
  // - Permissions-Policy: camera=(), microphone=(), geolocation=(self)

  next();
}

export function hidePoweredBy(req: Request, res: Response, next: NextFunction) {
  // TODO: Remove the "X-Powered-By" header
  res.removeHeader("X-Powered-By");
  next();
}
