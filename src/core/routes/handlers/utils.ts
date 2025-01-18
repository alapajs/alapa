import {
  Router as ExpressRouter,
  RequestHandler as ExpressRequestHandler,
  ErrorRequestHandler,
  RouterOptions,
} from "express";
import { Router } from ".";
import { StringObject } from "../../../interface";
import { isControllerString, normalizeURLPath } from "../../../utils";
import {
  RequestHandler,
  MethodList,
  RouteChain,
  Middleware,
  BasicRequestHandler,
} from "../interface";
import { RouteChainManger } from "./chain";
import { RouteFilter } from "./filter";
import { adjustNameWithPrefix } from "../utils";

export class RouterUtils {
  private routeChain: RouteChainManger;
  public routesNames: StringObject;
  public expressRouter: ExpressRouter;
  public filter = new RouteFilter();

  constructor(private router: Router, options?: RouterOptions) {
    this.expressRouter = ExpressRouter(options);
    this.routesNames = {};
    this.routeChain = new RouteChainManger(router, this.routesNames);
  }

  addExpressRoute(
    method: MethodList,
    path: string,
    ...handlers: (ExpressRequestHandler | ErrorRequestHandler)[]
  ) {
    path = "/" + normalizeURLPath(path);
    if (handlers.length == 0) {
      console.log("No handlers at", path);
      return null;
    }
    this.expressRouter[method](path, ...handlers);
  }

  addRoute(method: MethodList, path: string, ...handlers: RequestHandler[]) {
    const proceedHandler = this.filter.handlers(...handlers);
    if (proceedHandler.routers.length > 0) {
      throw new Error(
        `Router Class cannot be assigned to ${method} method at ${path} user middleware instead to process Router`
      );
    }
    this.addExpressRoute(method, path, ...proceedHandler.processed);
  }

  getRoutes(): ExpressRouter {
    return this.expressRouter;
  }

  addMethod(
    method: MethodList | false,
    path: string,
    ...handlers: RequestHandler[]
  ): RouteChain {
    if (method) this.addRoute(method, path, ...handlers);
    return this.routeChain.getChain(path);
  }

  use(pathOrHandler: Middleware, ...handlers: Middleware[]) {
    let path = null;
    if (typeof pathOrHandler === "string") {
      if (isControllerString(pathOrHandler)) {
        handlers.push(pathOrHandler);
      }
      path = pathOrHandler;
    } else {
      handlers.push(pathOrHandler);
    }
    const filter = this.filter.middlewares(...handlers);
    const middleware: (BasicRequestHandler | ErrorRequestHandler)[] = [];
    if (filter.processed.length > 0) {
      middleware.push(...filter.processed);
    }
    for (const route of filter.routers) {
      if (path) {
        adjustNameWithPrefix(path, route);
      }
      middleware.push(route.toExpressRoutes());
    }
    if (path) {
      try {
        this.expressRouter.use(path, middleware);
      } catch (e) {
        throw new Error(`${e}`);
      }
    } else {
      try {
        this.expressRouter.use(middleware);
      } catch (e) {
        throw new Error(`${e}`);
      }
    }
    return this.addMethod(false, "");
  }
}
