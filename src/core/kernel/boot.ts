import { Express } from "express";
import { Configuration } from "../../config";
import { activateGlobalMiddleware } from "../../security/middlewares/map";
import { GlobalConfig, setGlobalConfig } from "../../shared/globals";
import { Logger } from "../../utils";
import { updateRouteList } from "../routes/handlers/list";
import { activateRoutes } from "./activate-routes";
import { startRefreshServer } from "../../refresh/server";
import { refreshBrowsers } from "../../refresh";

export async function boot(configuration: Configuration) {
  const config = configuration;
  setGlobalConfig(config);
}

export function activateApp(app: Express) {
  startRefreshServer();
  Logger.info("Setting up Features...");
  const config = GlobalConfig;
  Logger.info("Setting up Middleware...");
  activateGlobalMiddleware(app, config);
  Logger.info("Setting up Routes...");
  activateRoutes(app);
  Logger.info("Updating routes names...");
  updateRouteList();
  Logger.success("Setup up completed!");
  refreshBrowsers();
}
