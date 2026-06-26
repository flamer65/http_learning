import { Request, Response, NextFunction } from "express";

export const sessionAuth = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Check if req.session && req.session.userId exists. If not -> 401
  req.session?.userId ? next() : res.status(401).json({ message: "Unauthorized" });
  // TODO: If exists -> next()
};
