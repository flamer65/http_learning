import { Request, Response, NextFunction } from "express";

export const sessionAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};
