/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from ".";
import { ResourcefulOptions } from "../interface/resourceful";
import { RoutesNames } from "../names";
import { RouteChain } from "../interface/route-chain";
import { StringObject } from "../../../interface/object";
import { ControllerClass, ControllerOptions } from "../interface/controller";
import { Middleware, RequestHandler } from "../interface/handler";

export class RouteChainManger {
  constructor(
    private router: Router,
    private routesNames: StringObject
  ) {}

  private addToMethod(
    method: string,
    path: string,
    ...handlers: RequestHandler[]
  ) {
    return (this.router as any)[method](path, ...handlers) as RouteChain;
  }

  public getChain(path: string): RouteChain {
    const routeChain: RouteChain = {
      name: (routeName: string) => {
        this.routesNames[routeName] = path;
        RoutesNames[routeName] = path;
        return routeChain;
      },

      all: (path: string, ...handlers: RequestHandler[]) =>
        this.addToMethod("all", path, ...handlers),

      get: (path: string, ...handlers: RequestHandler[]) =>
        this.addToMethod("get", path, ...handlers),

      post: (path: string, ...handlers: RequestHandler[]) =>
        this.addToMethod("post", path, ...handlers),

      put: (path: string, ...handlers: RequestHandler[]) =>
        this.addToMethod("put", path, ...handlers),

      delete: (path: string, ...handlers: RequestHandler[]) =>
        this.addToMethod("delete", path, ...handlers),

      patch: (path: string, ...handlers: RequestHandler[]) =>
        this.addToMethod("patch", path, ...handlers),

      options: (path: string, ...handlers: RequestHandler[]) =>
        this.addToMethod("options", path, ...handlers),

      head: (path: string, ...handlers: RequestHandler[]) =>
        this.addToMethod("head", path, ...handlers),

      use: (pathOrHandler: Middleware | string, ...handlers: Middleware[]) => {
        if (typeof pathOrHandler === "string") {
          return this.router.use(pathOrHandler, ...handlers);
        } else {
          return this.router.use(pathOrHandler);
        }
      },

      middleware: (
        pathOrHandler: Middleware | string,
        ...handlers: Middleware[]
      ) => {
        if (typeof pathOrHandler === "string") {
          return this.router.middleware(pathOrHandler, ...handlers);
        } else {
          return this.router.middleware(pathOrHandler);
        }
      },

      resource: (
        path: string,
        controller: ControllerClass,
        option?: ResourcefulOptions
      ) => this.router.resource(path, controller, option),

      restfulResource: (
        path: string,
        controller: ControllerClass,
        option?: ResourcefulOptions
      ) => this.router.restfulResource(path, controller, option),

      apiResource: (
        path: string,
        controller: ControllerClass,
        option?: ResourcefulOptions
      ) => this.router.apiResource(path, controller, option),

      controller: (
        path: string | ControllerClass,
        controller?: ControllerClass,
        option?: ControllerOptions
      ) => this.router.controller(path, controller, option),

      view: (path: string, view: string, data?: object) =>
        this.router.view(path, view, data!),
    };

    return routeChain;
  }
}
