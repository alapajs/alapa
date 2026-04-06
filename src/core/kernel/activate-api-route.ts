// import { passCSRF } from "../../security/middlewares/apis/csrf";
import { GlobalConfig } from "../../shared/globals";
import { Router } from "../routes";

export const apiRoutes = () => {
  const route = new Router();
  const apiRoutes = GlobalConfig.server.apiRoutes;
  if (Array.isArray(apiRoutes)) {
    for (const route of apiRoutes) {
      route.use("/api", route);
    }
  } else {
    route.use("/api", apiRoutes);
  }
  // route.use("/api",passCSRF)

  return route.toExpressRoutes();
};
