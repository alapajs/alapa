import { NextFunction, Request, Response } from "express";
import { Logger } from "../utils";
import { AnyObject } from "../interface";
const responseFinishedLogger = (
  req: Request,
  res: Response,
  durationMs: number
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
  const logType = process.env.REQUEST_LOG_TYPE || "basic";

  if (!isExcludedExtension && logType !== "none") {
    const currentTime = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const protocol = req.protocol;
    const host = req.get("host");
    const statusCode = res.statusCode;
    const ip = req.ip;
    const userAgent = req.get("User-Agent");
    const referer = req.get("Referer");
    const contentType = req.get("Content-Type");

    const basicLog = `${ip} - [${currentTime}] ${method} ${protocol}://${host}${url} - Status Code: ${statusCode} - Duration: ${durationMs}ms`;
    const detailedLog = `${basicLog} - User-Agent: ${userAgent} - Referer: ${referer} - Content-Type: ${contentType}`;
    const extendedLog = `${detailedLog} - Body: ${JSON.stringify(req.body)}`;
    const fullLog = `${extendedLog} - Query: ${JSON.stringify(req.query)}`;

    const log: AnyObject = {
      basic: basicLog,
      detailed: detailedLog,
      extended: extendedLog,
      full: fullLog,
    };

    Logger.log(log[logType] || log.basic);
  }
};

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now(); // record start time

  res.on("finish", () => {
    const durationMs = Date.now() - startTime; // calculate elapsed time
    responseFinishedLogger(req, res, durationMs);
  });

  next();
};
