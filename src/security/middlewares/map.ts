import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { templateContextMiddleware } from "./template-context";
import session from "express-session";
import bodyParser from "body-parser";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const csrf = require("@dr.pogodin/csurf");
import flash from "connect-flash";
import { csrfErrorHandler } from "./csrf-error";
import { sessionConfiguration } from "../../session/configuration";
import { manageCookiesSession } from "./manage-cookie-session";
import { requestLoggerMiddleware } from "./request-logger";
import { ServerContextMiddleware } from "./server-context";
import { changeMethod } from "./method";
import { changeResponses } from "./change-responses";
import { Configuration } from "../../config";
import fileUpload from "express-fileupload";
import { getTempDirectory } from "../../utils/get-temp-dir";
import { generalMiddleware } from "./general";
import cors from "cors";
import { renderTemplate } from "./render-template";
import { apiRoutes } from "../../core/kernel/activate-api-route";
import { activateDocsRoute } from "../../api/docs-generator/route";
import { normalizePath } from "./normalize-path";

export const activateGlobalMiddleware = async (
  app: Express,
  config: Configuration
) => {
  const middlewares = [
    renderTemplate,
    normalizePath,
    changeResponses,
    generalMiddleware,
    bodyParser.urlencoded({ extended: false }),
    express.urlencoded({ extended: true }),
    express.static(config.view.staticFilesPath ?? "static"),
    changeMethod,
    cors(),
    session(sessionConfiguration()),
    fileUpload({ useTempFiles: true, tempFileDir: getTempDirectory() }),
    cookieParser(),
    express.json(),
    manageCookiesSession,
    flash(),
    apiRoutes(),
    csrf({ cookie: process.env.NODE_ENV === "development" }),
    templateContextMiddleware,
    ServerContextMiddleware,
    csrfErrorHandler,
  ];
  app.all("*", requestLoggerMiddleware);
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
  if (config.server.proxy === true) {
    app.set("trust proxy", 1);
  }
  activateDocsRoute(app);
  // app.all("*", );
};
