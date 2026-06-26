import { Request, Response, NextFunction } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No authorization header" });
    return;
  }

  if (authHeader !== "Bearer valid-token") {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  next();
};
