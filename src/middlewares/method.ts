import { Request, Response, NextFunction } from "express";
export const changeMethod = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.method = (methodName: string) =>
    `<input type="hidden" name="_method" value="${methodName}" />`;
  const method = req.body["_method"];
  if (method) {
    req.method = method.toString().toUpperCase();
  }
  next();
};
