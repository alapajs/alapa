/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "../interface/general";
import {
  Router as ExpressRouter,
  RequestHandler as ExpressRequestHandler,
} from "express";
import { RouteChain } from "../interface/route-chain";
import { IRouter } from "../interface/router";
import { RouterOptions } from "express";
import { MethodList } from "../interface/method";
import { RouteChainManger } from "./chain";
import { processHandlers } from "./processor";
import { ResourcefulOptions } from "../interface/resourceful";
import { MiddlewareRouteHandler } from "./middleware";
import { adjustNameWithPrefix } from "../utils";
import { StringObject } from "../../../interface/object";
import { ResourceRouteManager } from "./resource";

export class Router implements IRouter {
  private routeChain: RouteChainManger;
  private expressRouter: ExpressRouter;
  private routesNames: StringObject;
  private middleware: MiddlewareRouteHandler;
  private resourceHandlers: ResourceRouteManager;

  constructor(options?: RouterOptions) {
    this.routesNames = {};
    this.expressRouter = ExpressRouter(options);
    this.routeChain = new RouteChainManger(this, this.routesNames);
    this.resourceHandlers = new ResourceRouteManager(this);
    this.middleware = new MiddlewareRouteHandler();
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
    controller: any,
    option?: ResourcefulOptions
  ): RouteChain {
    return this.resourceHandlers.resource(path, controller, option);
  }

  public restfulResource(
    path: string,
    controller: any,
    option?: ResourcefulOptions
  ): RouteChain {
    return this.resourceHandlers.restfulResource(path, controller, option);
  }

  public apiResource(
    path: string,
    controller: any,
    option?: ResourcefulOptions
  ): RouteChain {
    return this.resourceHandlers.apiResource(path, controller, option);
  }

  public resources(
    resources: { [route: string]: any },
    options: ResourcefulOptions
  ): RouteChain {
    return this.resourceHandlers.resources(resources, options);
  }

  public restfulResources(
    resources: { [route: string]: any },
    options: ResourcefulOptions
  ): RouteChain {
    return this.resourceHandlers.restfulResources(resources, options);
  }

  public apiResources(
    resources: { [route: string]: any },
    options: ResourcefulOptions
  ): RouteChain {
    return this.resourceHandlers.apiResources(resources, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    ...handlers: ExpressRequestHandler[]
  ) {
    this.expressRouter[method](path, ...handlers);
  }

  private addRoute(
    method: MethodList,
    path: string,
    ...handlers: RequestHandler[]
  ) {
    const proceedHandler = processHandlers(...handlers);
    this.addExpressRoute(method, path, ...proceedHandler);
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

  public use(
    pathOrHandler: string | RequestHandler | Router | IRouter,
    ...handlers: RequestHandler[] | Router[] | IRouter[]
  ): RouteChain {
    return this.processUse(pathOrHandler, ...handlers);
  }

  public all(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.addMethod("all", path, ...handlers);
  }

  protected processUse(
    pathOrHandler: string | RequestHandler | Router | IRouter,
    ...handlers: RequestHandler[] | Router[] | IRouter[]
  ) {
    const result = this.middleware.processUse(pathOrHandler, ...handlers);
    const middleware: any[] = [];
    if (result.processed.length > 0) {
      middleware.push(...result.processed);
    }
    for (const route of result.routers) {
      if (result.path) {
        adjustNameWithPrefix(result.path, route);
      }
      middleware.push(route.toExpressRoutes());
    }
    if (result.path) {
      this.expressRouter.use(result.path, middleware);
    } else {
      this.expressRouter.use(middleware);
    }
    return this.all("");
  }
}
