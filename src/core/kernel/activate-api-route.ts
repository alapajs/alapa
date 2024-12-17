import { GlobalConfig } from "../../shared/globals";
import { Router } from "../routes";

export const apiRoutes = () => {
  const route = new Router();
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
