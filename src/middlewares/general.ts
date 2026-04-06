import { Request, RequestHandler, Response } from "express";
import { NextFunction } from "../core";
import { MiddlewareConfiguration } from "../config";
import { empty } from "../utils";
export const generalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.setHeader("X-Powered-By", "Alapa");
  next();
};

export const buildGeneralMiddleware = (
  config?: MiddlewareConfiguration,
): RequestHandler[] => {
  if (!config) {
    return [];
  }

  const handlers: RequestHandler[] = [];

  const { global, routeSpecific } = config;

  if (!empty(global)) {
    handlers.push(...(global as any));
  }

  if (!empty(routeSpecific)) {
    Object.entries(routeSpecific as any).forEach(([route, middlewares]) => {
      (middlewares as any).forEach((mw: RequestHandler) => {
        handlers.push((req, res, next) => {
          if (req.path.startsWith(route)) {
            return mw(req, res, next);
          }
          next();
        });
      });
    });
  }

  return handlers;
};
