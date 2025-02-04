import { RouteChain } from "../interface/route-chain";
import { IRouter } from "../interface/router";
import { RouterOptions } from "express";
import { ResourcefulOptions } from "../interface/resourceful";
import { ResourceRouteManager } from "./resource";
import { ControllerClass, ControllerOptions } from "../interface/controller";
import { ControllerHandler } from "./controller";
import { Middleware, RequestHandler } from "../interface/handler";
import { RouterUtils } from "./utils";
import { ViewHandler } from "./view";
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

  get(path: string, handler: RequestHandler): RouteChain;
  get(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;
  public get(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("get", path, ...handlers);
  }

  post(path: string, handler: RequestHandler): RouteChain;
  post(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;

  public post(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("post", path, ...handlers);
  }

  public put(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("put", path, ...handlers);
  }

  delete(path: string, handler: RequestHandler): RouteChain;
  delete(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;
  public delete(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("delete", path, ...handlers);
  }

  patch(path: string, handler: RequestHandler): RouteChain;
  patch(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;
  public patch(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("patch", path, ...handlers);
  }
  options(path: string, handler: RequestHandler): RouteChain;
  options(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;
  public options(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("options", path, ...handlers);
  }
  head(path: string, handler: RequestHandler): RouteChain;
  head(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;
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

  view(path: string, view: string): RouteChain;
  view(path: string, view: string, data: object): RouteChain;
  public view(path: string, view: string, data?: object): RouteChain {
    const viewHandler: ViewHandler = new ViewHandler(this);
    return viewHandler.add(path, view, data);
  }

  public toExpressRoutes() {
    return this.utils.getRoutes();
  }

  use(middleware: Middleware): RouteChain;
  use(path: string, ...handlers: Middleware[]): RouteChain;
  public use(pathOrHandler: Middleware, ...handlers: Middleware[]): RouteChain {
    return this.utils.use(pathOrHandler, ...handlers);
  }

  middleware(middleware: Middleware): RouteChain;
  middleware(path: string, ...handlers: Middleware[]): RouteChain;
  public middleware(
    pathOrHandler: Middleware,
    ...handlers: Middleware[]
  ): RouteChain {
    return this.utils.use(pathOrHandler, ...handlers);
  }

  all(path: string, handler: RequestHandler): RouteChain;
  all(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;
  public all(path: string, ...handlers: RequestHandler[]): RouteChain {
    return this.utils.addMethod("all", path, ...handlers);
  }
}
