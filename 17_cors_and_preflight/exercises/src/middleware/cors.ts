import { Request, Response, NextFunction } from "express";

export const customCors = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = ["http://localhost:3000", "https://myapp.com"];
  const origin = req.headers.origin;

  // TODO: Check if origin is allowed. If so, set Access-Control-Allow-Origin
  if (origin && allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  // TODO: Set Vary: Origin
  res.set("Vary", "Origin");
  // TODO: Set Access-Control-Allow-Credentials to true
  res.set("Access-Control-Allow-Credentials", "true");
  // TODO: Set Access-Control-Expose-Headers for X-Request-Id, X-Total-Count
  res.set("Access-Control-Expose-Headers", "X-Request-Id, X-Total-Count");
  // Handle Preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    // TODO: Set Access-Control-Allow-Methods (include GET, POST, PUT, DELETE, OPTIONS)
    res.set("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    // TODO: Set Access-Control-Allow-Headers (echo back requested headers from req.headers['access-control-request-headers'])
    const requestHeaders = req.headers["access-control-request-headers"];
    if (requestHeaders) {
      res.set("Access-Control-Allow-Headers", requestHeaders);
    }
    // TODO: Set Access-Control-Max-Age to 86400
    res.set("Access-Control-Max-Age", "86400");
    // TODO: Send 204 No Content
    res.status(204).end();
    return;
  }

  next();
};
