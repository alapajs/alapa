import { IRouter } from "../interface/router";
import { Router } from ".";
import { ResourcefulOptions } from "../interface/resourceful";
import { RoutesNames } from "../names";
import { RouteChain } from "../interface/route-chain";
import { StringObject } from "../../../interface/object";
import { ControllerClass, ControllerOptions } from "../interface/controller";
import { RequestHandler } from "../interface/handler";

export class RouteChainManger {
  constructor(private router: Router, private routesNames: StringObject) {}
  public getChain(path: string): RouteChain {
    const routeChain: RouteChain = {
      name: (routeName: string) => {
        this.routesNames[routeName] = path;
        RoutesNames[routeName] = path;
        // addToRouteList(path, method, routeName, ...handlers);
        return routeChain;
      },
      all: (path: string, ...handlers: RequestHandler[]) =>
        this.router.all(path, ...handlers),
      get: (path: string, ...handlers: RequestHandler[]) =>
        this.router.get(path, ...handlers),
      post: (path: string, ...handlers: RequestHandler[]) =>
        this.router.post(path, ...handlers),
      put: (path: string, ...handlers: RequestHandler[]) =>
        this.router.put(path, ...handlers),
      delete: (path: string, ...handlers: RequestHandler[]) =>
        this.router.delete(path, ...handlers),
      patch: (path: string, ...handlers: RequestHandler[]) =>
        this.router.patch(path, ...handlers),
      options: (path: string, ...handlers: RequestHandler[]) =>
        this.router.options(path, ...handlers),
      head: (path: string, ...handlers: RequestHandler[]) =>
        this.router["head"](path, ...handlers),
      use: (
        pathOrHandler: string | RequestHandler | IRouter,
        ...handlers: RequestHandler[] | IRouter[]
      ) => this.router.use(pathOrHandler, ...handlers),
      resource: (
        path: string,
        controller: ControllerClass,
        option?: ResourcefulOptions
      ) => this.router.resource(path, controller, option),
      // controller: (path: string, controller: any, option?: ResourceOptions) =>
      //   this.router.controller(path, controller, option),

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
        this.router.view(path, view, data),
    };
    return routeChain;
  }
}
