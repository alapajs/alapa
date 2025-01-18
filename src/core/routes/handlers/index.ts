/* eslint-disable @typescript-eslint/no-unused-vars */
import { RouteChain } from "../interface/route-chain";
import { IRouter } from "../interface/router";
import { RouterOptions } from "express";
import { ResourcefulOptions } from "../interface/resourceful";
import { ResourceRouteManager } from "./resource";
import { ControllerClass, ControllerOptions } from "../interface/controller";
import { ControllerHandler } from "./controller";
import { Middleware, RequestHandler } from "../interface/handler";
import { RouterUtils } from "./utils";

export class Router implements IRouter {
  private resourceHandlers: ResourceRouteManager;
  private controllerHandler: ControllerHandler = new ControllerHandler();
  private utils: RouterUtils;
  constructor(options?: RouterOptions) {
    this.resourceHandlers = new ResourceRouteManager(this);
    this.utils = new RouterUtils(this, options);
    this.controllerHandler.addRout(this);
  }
  public getNames = () => this.utils.routesNames;

  public get(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("get", path, ...handlers);
  }

  public post(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("post", path, ...handlers);
  }

  public put(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("put", path, ...handlers);
  }

  public delete(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("delete", path, ...handlers);
  }

  public patch(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("patch", path, ...handlers);
  }

  public options(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("options", path, ...handlers);
  }

  public head(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("head", path, ...handlers);
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
    return this.utils.getRoutes();
  }

  public use(pathOrHandler: Middleware, ...handlers: Middleware[]): RouteChain {
    return this.utils.use(pathOrHandler, ...handlers);
  }

  public all(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("all", path, ...handlers);
  }
}
