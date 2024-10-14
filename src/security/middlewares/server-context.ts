import { NextFunction, Request, Response } from "express";
import { getRouteByName } from "../../core/routes/names";
import { AnyObject } from "../../interface/object";

export const ServerContextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.context = {
    req,
    res,
  };
  req.getRoute = (name: string, ...param: (string | number | AnyObject)[]) =>
    getRouteByName(name, ...param);
  req.getUrl = req.getRoute;
  next();
};
