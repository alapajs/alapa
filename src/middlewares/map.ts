import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { templateContextMiddleware } from "./template-context";
import session from "express-session";
import bodyParser from "body-parser";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const csrf = require("@dr.pogodin/csurf");
import { csrfErrorHandler } from "./csrf-error";
import { sessionConfiguration } from "../session/configuration";
import { manageCookiesSession } from "./manage-cookie-session";
import { requestLoggerMiddleware } from "./request-logger";
import { ServerContextMiddleware } from "./server-context";
import { changeMethod } from "./method";
import { changeResponses } from "./change-responses";
import { Configuration } from "../config";
import fileUpload from "express-fileupload";
import { getTempDirectory } from "../utils/get-temp-dir";
import { buildGeneralMiddleware, generalMiddleware } from "./general";
import cors from "cors";
import { renderTemplate } from "./render-template";
import { apiRoutes } from "../core/kernel/activate-api-route";
import { activateDocsRoute } from "../api/docs-generator/route";
import { normalizePath } from "./normalize-path";
import { flash } from "./flash";
import { validateMiddleWare } from "./validation";
import { notFound } from "./error";
import { ENV } from "../shared";
import { wellKnownPath, wellKnownRoute } from "../dev/well-know-route";
import { GlobalConfig } from "../shared/globals";
import { buildRateLimit } from "./rate-limit/build";
export const activateGlobalMiddleware = async (
  app: Express,
  config: Configuration,
) => {
  const rateLimitMiddleware = buildRateLimit(config.rateLimit);
  const userGeneralMiddlewares = buildGeneralMiddleware(config.middleware);
  const middlewares = [
    normalizePath,
    ...rateLimitMiddleware,
    renderTemplate,
    changeResponses,
    validateMiddleWare,
    generalMiddleware,
    ...userGeneralMiddlewares,
    bodyParser.urlencoded({ extended: false }),
    express.urlencoded({ extended: true }),
    express.static(config.templateEngine.staticFilesPath ?? "static"),
    changeMethod,
    cors(),
    session(sessionConfiguration()),
    fileUpload({ useTempFiles: true, tempFileDir: getTempDirectory() }),
    cookieParser(),
    express.json(),
    manageCookiesSession,
    flash,
    requestLoggerMiddleware,
    apiRoutes(),
    csrf({ cookie: ENV === "development" }),
    templateContextMiddleware,
    ServerContextMiddleware,
    csrfErrorHandler,
  ];

  app.enable("trust proxy");
  if (config.server.trustedProxies === true) {
    app.set("trust proxy", true);
  } else if (typeof config.server.trustedProxies === "number") {
    app.set("trust proxy", config.server.trustedProxies);
  } else if (typeof config.server.trustedProxies === "string") {
    app.set("trust proxy", config.server.trustedProxies);
  } else if (Array.isArray(config.server.trustedProxies)) {
    app.set("trust proxy", config.server.trustedProxies);
  }

  // app.all("*", requestLoggerMiddleware);

  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
  if (ENV === "development") {
    app.get(wellKnownPath, wellKnownRoute);
  }
  await activateDocsRoute(app);
  app.all("*", notFound);
};
