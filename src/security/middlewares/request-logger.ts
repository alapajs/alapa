import { NextFunction, Request, Response } from "express";
import { Logger } from "../../utils";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const excludedExtensions = [
    ".js",
    ".css",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".ico",
  ];
  const isExcludedExtension = excludedExtensions.some((ext) =>
    req.url.endsWith(ext)
  );
  if (!isExcludedExtension) {
    const currentTime = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const protocol = req.protocol;
    const host = req.get("host");
    const statusCode = res.statusCode;
    Logger.log(
      `[${currentTime}] ${method} ${protocol}://${host}${url} - Status Code: ${statusCode}`
    );
  }
  next();
};
