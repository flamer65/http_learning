import { Request, Response, NextFunction } from 'express';

export const customCors = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = ["http://localhost:3000", "https://myapp.com"];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "X-Request-Id, X-Total-Count");

  if (req.method === 'OPTIONS') {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    const requestHeaders = req.headers["access-control-request-headers"];
    if (requestHeaders) {
      res.setHeader("Access-Control-Allow-Headers", requestHeaders);
    }
    
    res.setHeader("Access-Control-Max-Age", "86400");
    res.status(204).end();
    return;
  }

  next();
};
