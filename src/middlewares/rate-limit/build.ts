import { RateLimitConfiguration } from "../../config";
import { RequestHandler } from "express";

export const buildRateLimit = (
  config?: RateLimitConfiguration,
): RequestHandler[] => {
  if (!config?.enable) {
    return [];
  }

  const handlers: RequestHandler[] = [];

  const { global, routeSpecific } = config;

  if (global) {
    handlers.push(...global);
  }

  if (routeSpecific) {
    Object.entries(routeSpecific).forEach(([route, middlewares]) => {
      middlewares.forEach((mw) => {
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
