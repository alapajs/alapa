import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { templateContextMiddleware } from "./template-context";
import session from "express-session";
import bodyParser from "body-parser";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const csrf = require("@dr.pogodin/csurf");
import flash from "connect-flash";
import { csrfErrorHandler } from "./csrf-error";
import { sessionConfiguration } from "../session/configuration";
import { manageCookiesSession } from "./manage-cookie-session";
import { requestLoggerMiddleware } from "./request-logger";
import { ServerContextMiddleware } from "./server-context";
import { changeMethod } from "./method";
import { changeResponses } from "./change-responses";
import { getApiRoutes } from "../../core/kernel/activate-api-route";
import { Configuration } from "../../config";
import fileUpload from "express-fileupload";
import { getTempDirectory } from "../../utils/get-temp-dir";
import { generalMiddleware } from "./general";

export const activateGlobalMiddleware = (
  server: Express,
  config: Configuration
) => {
  const apiRoutes = getApiRoutes(config);
  const middlewares = [
    generalMiddleware,
    bodyParser.urlencoded({ extended: false }),
    express.urlencoded({ extended: true }),
    express.static(config.view.staticFilesPath ?? "static"),
    changeMethod,
    changeResponses,
    session(sessionConfiguration),
    fileUpload({ useTempFiles: true, tempFileDir: getTempDirectory() }),
    cookieParser(),
    express.json(),
    manageCookiesSession,
    apiRoutes,
    flash(),
    csrf({ cookie: process.env.NODE_ENV === "development" }),
    templateContextMiddleware,
    ServerContextMiddleware,
    csrfErrorHandler,
    requestLoggerMiddleware,
  ];

  middlewares.forEach((middleware) => {
    server.use(middleware);
  });
};
