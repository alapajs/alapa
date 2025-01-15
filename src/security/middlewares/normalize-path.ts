import { NextFunction, Request, Response } from "express";
// import normalizeUrl from "normalize-url";
import { normalizeURLPath } from "../../utils";

export const normalizePath = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.url = "/" + normalizeURLPath(req.url);
  next();
};
