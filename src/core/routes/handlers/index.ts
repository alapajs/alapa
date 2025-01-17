/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Router as ExpressRouter,
  RequestHandler as ExpressRequestHandler,
} from "express";
import { RouteChain } from "../interface/route-chain";
import { IRouter } from "../interface/router";
import { RouterOptions } from "express";
import { MethodList } from "../interface/method";
import { RouteChainManger } from "./chain";
import { ResourcefulOptions } from "../interface/resourceful";
import { adjustNameWithPrefix } from "../utils";
import { StringObject } from "../../../interface/object";
import { ResourceRouteManager } from "./resource";
import { ControllerClass, ControllerOptions } from "../interface/controller";
import { ControllerHandler } from "./controller";
import { isControllerString, Logger, normalizeURLPath } from "../../../utils";
import {
  BasicRequestHandler,
  ErrorRequestHandler,
  Middleware,
  RequestHandler,
} from "../interface/handler";
import { RouteFilter } from "./filter";

export class Router implements IRouter {
  private routeChain: RouteChainManger;
  private expressRouter: ExpressRouter;
  private routesNames: StringObject;
  private resourceHandlers: ResourceRouteManager;
  private controllerHandler: ControllerHandler = new ControllerHandler();
  private filter = new RouteFilter();

  constructor(options?: RouterOptions) {
    this.routesNames = {};
    this.expressRouter = ExpressRouter(options);
    this.routeChain = new RouteChainManger(this, this.routesNames);
    this.resourceHandlers = new ResourceRouteManager(this);
    this.controllerHandler.addRout(this);
  }
  public getNames = () => this.routesNames;

  public get(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.addMethod("get", path, ...handlers);
  }

  public post(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.addMethod("post", path, ...handlers);
  }

  public put(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.addMethod("put", path, ...handlers);
  }

  public delete(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.addMethod("delete", path, ...handlers);
  }

  public patch(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.addMethod("patch", path, ...handlers);
  }

  public options(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.addMethod("options", path, ...handlers);
  }

  public head(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.addMethod("head", path, ...handlers);
  }

  public resource(
    path: string,
    controller: ControllerClass,
    option?: ResourcefulOptions
  ): RouteChain {
    return this.resourceHandlers.resource(path, controller, option);
  }

  controller(
    path: string,
    controller: ControllerClass,
    option?: ControllerOptions
  ): RouteChain;

  // The second method overload
  controller(
    controller: ControllerClass,
    option: ControllerOptions
  ): RouteChain;

  // The third method overload
  controller(controller: ControllerClass): RouteChain;

  public controller(
    pathOrController: string | ControllerClass,
    controller?: ControllerClass | ControllerOptions,
    option?: ControllerOptions | ControllerClass
  ): RouteChain {
    return this.controllerHandler.controller(
      pathOrController,
      controller,
      option
    );
  }

  public restfulResource(
    path: string,
    controller: ControllerClass,
    option?: ResourcefulOptions
  ): RouteChain {
    return this.resourceHandlers.restfulResource(path, controller, option);
  }

  public apiResource(
    path: string,
    controller: ControllerClass,
    option?: ResourcefulOptions
  ): RouteChain {
    return this.resourceHandlers.apiResource(path, controller, option);
  }

  public view(path: string, view: string, data?: object): RouteChain {
    // return this.processView(path, view, data);]
    return this.get(path, view);
  }

  public toExpressRoutes() {
    return this.getRoutes();
  }

  public addExpressRoute(
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

  private addRoute(
    method: MethodList,
    path: string,
    ...handlers: RequestHandler[]
  ) {
    const proceedHandler = this.filter.handlers(...handlers);
    if (proceedHandler.routers.length > 0) {
      throw new Error(
        `Router Class cannot be assigned to ${method} method at ${path} user middleware instead to process Router`
      );
    }
    this.addExpressRoute(method, path, ...proceedHandler.processed);
  }

  private getRoutes(): ExpressRouter {
    return this.expressRouter;
  }

  private addMethod(
    method: MethodList,
    path: string,
    ...handlers: RequestHandler[]
  ): RouteChain {
    this.addRoute(method, path, ...handlers);
    return this.routeChain.getChain(path);
  }

  public use(pathOrHandler: Middleware, ...handlers: Middleware[]): RouteChain {
    return this.processUse(pathOrHandler, ...handlers);
  }

  public all(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.addMethod("all", path, ...handlers);
  }

  protected processUse(pathOrHandler: Middleware, ...handlers: Middleware[]) {
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
    return this.all("");
  }
}
