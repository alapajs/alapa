import { Request, Response } from "express";
import { NextFunction } from "../../core";
export const generalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader("X-Powered-By", "Alapa");
  next();
};
