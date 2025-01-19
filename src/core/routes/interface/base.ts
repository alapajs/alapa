import { RouteChain } from "./route-chain";
import { ResourcefulOptions } from "../handlers/extension";
import { ControllerClass, IControllerHandler } from "./controller";
import { MethodHandlers } from "./handler-overloading";
/**
 * BaseRouterInterface
 *
 * This interface defines methods for routing and handling resources in a web application,
 * providing methods for setting up routes with controllers, resources, and various HTTP methods.
 */
export interface BaseRouterInterface
  extends IControllerHandler,
    MethodHandlers {
  /**
   * resource
   *
   * Sets up a resourceful route for a given path, associating it with a controller and optional settings.
   * A resourceful route typically maps the standard CRUD operations (create, read, update, delete) to controller methods.
   *
   * @param path - The path to the resource route.
   * @param controller - The controller handling the resourceful routes.
   * @param option - Optional configuration options for resource handling.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  resource: (
    path: string,
    controller: ControllerClass,
    option?: ResourcefulOptions
  ) => RouteChain;

  /**
   * restfulResource
   *
   * Similar to `resource`, but specifically handles RESTful-style routes with a controller.
   * This can be used to map CRUD operations to RESTful API conventions.
   *
   * @param path - The path to the resource route.
   * @param controller - The controller handling the RESTful resource routes.
   * @param option - Optional configuration options for RESTful resource handling.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  restfulResource: (
    path: string,
    controller: ControllerClass,
    option?: ResourcefulOptions
  ) => RouteChain;

  /**
   * apiResource
   *
   * Sets up API-specific resource routes, associating them with a controller and optional configuration.
   * This method is typically used for API endpoints that follow resourceful conventions.
   *
   * @param path - The path to the API resource route.
   * @param controller - The controller managing the API resource.
   * @param option - Optional configuration options for API resource handling.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  apiResource: (
    path: string,
    controller: ControllerClass,
    option?: ResourcefulOptions
  ) => RouteChain;

  view: (path: string, view: string, data?: object) => RouteChain;
}
