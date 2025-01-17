import { IRouter, Router } from "express";
import { RouteChain } from "./route-chain";
import { ResourcefulOptions } from "../handlers/extension";
import { ControllerClass, IControllerHandler } from "./controller";
import { RequestHandler } from "./handler";

/**
 * BaseRouterInterface
 *
 * This interface defines methods for routing and handling resources in a web application,
 * providing methods for setting up routes with controllers, resources, and various HTTP methods.
 */
export interface BaseRouterInterface extends IControllerHandler {
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

  /**
   * controller
   *
   * Associates a controller with a specific path. This is used to define a set of routes handled by
   * a controller class or an object with controller options.
   *
   * @param path - The path to the controller route or a controller class.
   * @param controller - The controller class or options for the controller.
   * @param option - Optional configuration for the controller.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */

  /**
   * all
   *
   * Registers a route handler for all HTTP methods (GET, POST, PUT, etc.) for a given path.
   * This method is useful for catch-all routes or when you need a handler for any method.
   *
   * @param path - The path to apply the handler to.
   * @param handlers - One or more handler functions to execute for all HTTP methods on the path.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  all: (path: string, ...handlers: RequestHandler[]) => RouteChain;

  /**
   * get
   *
   * Registers a GET route for a given path. Typically used for fetching resources or data from the server.
   *
   * @param path - The path for the GET route.
   * @param handlers - One or more handler functions for the GET request.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  get: (path: string, ...handlers: RequestHandler[]) => RouteChain;

  /**
   * post
   *
   * Registers a POST route for a given path. Typically used for creating or submitting resources to the server.
   *
   * @param path - The path for the POST route.
   * @param handlers - One or more handler functions for the POST request.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  post: (path: string, ...handlers: RequestHandler[]) => RouteChain;

  /**
   * put
   *
   * Registers a PUT route for a given path. Typically used for updating an entire resource on the server.
   *
   * @param path - The path for the PUT route.
   * @param handlers - One or more handler functions for the PUT request.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  put: (path: string, ...handlers: RequestHandler[]) => RouteChain;

  /**
   * delete
   *
   * Registers a DELETE route for a given path. Typically used for removing a resource from the server.
   *
   * @param path - The path for the DELETE route.
   * @param handlers - One or more handler functions for the DELETE request.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  delete: (path: string, ...handlers: RequestHandler[]) => RouteChain;

  /**
   * patch
   *
   * Registers a PATCH route for a given path. Typically used for making partial updates to a resource on the server.
   *
   * @param path - The path for the PATCH route.
   * @param handlers - One or more handler functions for the PATCH request.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  patch: (path: string, ...handlers: RequestHandler[]) => RouteChain;

  /**
   * options
   *
   * Registers an OPTIONS route for a given path. Typically used for determining communication options or CORS requests.
   *
   * @param path - The path for the OPTIONS route.
   * @param handlers - One or more handler functions for the OPTIONS request.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  options: (path: string, ...handlers: RequestHandler[]) => RouteChain;

  /**
   * head
   *
   * Registers a HEAD route for a given path. Typically used for retrieving only the headers of a resource, without the body.
   *
   * @param path - The path for the HEAD route.
   * @param handlers - One or more handler functions for the HEAD request.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  head: (path: string, ...handlers: RequestHandler[]) => RouteChain;

  /**
   * view
   *
   * Registers a route for rendering views. This is commonly used in MVC architectures where views are rendered on the server.
   *
   * @param path - The path to the view route.
   * @param view - The view name to be rendered.
   * @param data - Optional data to pass to the view for rendering.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  view: (path: string, view: string, data?: object) => RouteChain;

  /**
   * use
   *
   * Registers middleware functions for the given path or globally. This method is used to apply middleware to handle requests before reaching route handlers.
   *
   * @param pathOrHandler - The path where the middleware should apply or a middleware handler function itself.
   * @param handlers - One or more handler functions or routers to be used as middleware.
   *
   * @returns A `RouteChain` instance for further chaining of route configuration.
   */
  use: (
    pathOrHandler: string | RequestHandler | Router | IRouter,
    ...handlers: RequestHandler[] | Router[] | IRouter[]
  ) => RouteChain;
}
