/* eslint-disable @typescript-eslint/no-unused-vars */
import { Express, Request, Response, NextFunction } from "express";
import { GlobalConfig } from "../../shared/globals";
import { Logger } from "../../utils";
import { openFileWithVscode } from "./open-file-with-vscode";
export const activateRoutes = (server: Express) => {
  const routes = GlobalConfig.server.routes;
  if (Array.isArray(routes)) {
    for (const route of routes) {
      server.use(route.toExpressRoutes());
    }
  } else {
    server.use(routes.toExpressRoutes());
  }

  server.use("/open-file-in-editor", openFileWithVscode);

  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    let csrfToken = "";
    try {
      csrfToken = req.csrfToken();
    } catch (e) {
      //
    }
    const data = {
      error: err.stack,
      title: err.message,
      csrfToken: csrfToken,
      host: `${req.protocol}://${req.get("host")}`,
    };
    Logger.error(err.stack); // Log the error stack to the console
    res.status(500).json(data); // Render the 500 error page
  });
};
