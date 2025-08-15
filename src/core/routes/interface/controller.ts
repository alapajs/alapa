/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, RestfulController } from "../../../controller";
import {
  ApiResource,
  ResourcefulController,
  RestfulResource,
} from "../../../controller/abstract";
import { FunctionKeys } from "../../../models";
import { Middleware } from "./handler";
import { RouteChain } from "./route-chain";

export interface ControllerOptions<T = any> {
  middlewareAll?: Middleware[];
  middleware?: Record<FunctionKeys<T>, Middleware[]>;
  namePrefix?: string;
  docPrefix?: string;
}

export type ControllerClass = any;
type ControllersType<T> = T extends Controller
  ? Controller
  : T extends RestfulController
    ? RestfulController
    : T extends ResourcefulController
      ? ResourcefulController
      : T extends RestfulResource
        ? RestfulResource
        : T extends ApiResource
          ? ApiResource
          : never;

export type ControllerConstructor<T> = {
  new (...args: any[]): ControllersType<T>;
};

/**
 * Interface for handling controller registration and routing.
 * It defines method overloads for registering controllers and their associated routes
 * with optional configuration options.
 *
 * @interface IControllerHandler
 */
export interface IControllerHandler {
  /**
   * Registers a controller with a specific path.
   * This method allows defining a route with a specified path for the controller.
   *
   * @param {string} path - The URL path associated with the controller.
   * @param { ControllerConstructor<Controller>} controller - The controller class to register.
   * @returns {RouteChain} - The route chain object for chaining further route definitions.
   */
  controller(
    path: string,
    controller: ControllerConstructor<Controller>
  ): RouteChain;

  /**
   * Registers a controller with a specific path and optional configuration options.
   * This method allows defining a route with a specified path for the controller.
   *
   * @param {string} path - The URL path associated with the controller.
   * @param { ControllerConstructor<Controller>} controller - The controller class to register.
   * @param {ControllerOptions} [option] - Optional configuration settings for the controller.
   * @returns {RouteChain} - The route chain object for chaining further route definitions.
   */
  controller(
    path: string,
    controller: ControllerConstructor<Controller>,
    option: ControllerOptions<Controller>
  ): RouteChain;

  /**
   * Registers a controller with optional configuration options.
   * This method is used when no specific path is provided for the controller.
   *
   * @param {ControllerConstructor<Controller>} controller - The controller class to register.
   * @param {ControllerOptions} option - Configuration settings for the controller.
   * @returns {RouteChain} - The route chain object for chaining further route definitions.
   */
  controller(
    controller: ControllerConstructor<Controller>,
    option: ControllerOptions<Controller>
  ): RouteChain;

  /**
   * Registers a controller without any configuration options.
   * This method is used when no path or configuration is required.
   *
   * @param { ControllerConstructor<Controller>} controller - The controller class to register.
   * @returns {RouteChain} - The route chain object for chaining further route definitions.
   */
  controller(controller: ControllerConstructor<Controller>): RouteChain;
}
