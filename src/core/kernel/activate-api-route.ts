import { Router as eRouter } from "express";

import { apiDoc } from "../../api/doc-route";
import { GlobalConfig } from "../../shared/globals";
import { Configuration } from "../..";
import { Router } from "../routes";

export const getApiRoutes = (config: Configuration) => {
  const route = new Router();
  const doc = apiDoc();
  const exRoute = eRouter();

  exRoute.use(config.api.docUrl, ...doc);

  route.use(exRoute).name("api.doc");

  const apiRoutes = GlobalConfig.server.apiRoutes;
  if (Array.isArray(apiRoutes)) {
    for (const route of apiRoutes) {
      route.use("/api", route).name("api");
    }
  } else {
    route.use("/api", apiRoutes).name("api");
  }

  return route.toExpressRoutes();
};
