import { IMiddlewareRouteHandler } from "./general";

/**
 * Defines the custom verb names for resourceful routes.
 * Used to configure the route actions like index, create, show, etc.
 */
export interface ResourcefulVerb {
  /**
   * Name for the index route, typically used to retrieve a list of resources.
   */
  index?: string;

  /**
   * Name for the create route, typically used to display a form for creating a new resource.
   */
  create?: string;

  /**
   * Name for the store route, typically used to handle the submission of a new resource.
   */
  store?: string;

  /**
   * Name for the show route, typically used to retrieve and display a specific resource.
   */
  show?: string;

  /**
   * Name for the edit route, typically used to display a form for editing an existing resource.
   */
  edit?: string;

  /**
   * Name for the update route, typically used to handle the submission of changes to an existing resource.
   */
  update?: string;

  /**
   * Name for the delete route, typically used to remove a specific resource.
   */
  destroy?: string;
}

/**
 * Middleware functions for resourceful routes.
 * Middleware can be executed before or after the route handler.
 */
export interface ResourcefulMiddleware {
  /**
   * Middleware function to be executed before the index action.
   */
  index?: IMiddlewareRouteHandler | IMiddlewareRouteHandler[];

  /**
   * Middleware function to be executed before the create action.
   */
  create?: IMiddlewareRouteHandler | IMiddlewareRouteHandler[];

  /**
   * Middleware function to be executed before the store action.
   */
  store?: IMiddlewareRouteHandler | IMiddlewareRouteHandler[];

  /**
   * Middleware function to be executed before the show action.
   */
  show?: IMiddlewareRouteHandler | IMiddlewareRouteHandler[];

  /**
   * Middleware function to be executed before the edit action.
   */
  edit?: IMiddlewareRouteHandler | IMiddlewareRouteHandler[];

  /**
   * Middleware function to be executed before the update action.
   */
  update?: IMiddlewareRouteHandler | IMiddlewareRouteHandler[];

  /**
   * Middleware function to be executed before the destroy action.
   */
  destroy?: IMiddlewareRouteHandler | IMiddlewareRouteHandler[];

  /**
   * Middleware function to be executed before all actions.
   * Executed before any route handler is invoked.
   */
  before?: IMiddlewareRouteHandler | IMiddlewareRouteHandler[];
  /**
   * Middleware function to be executed after all actions.
   * Executed after a route handler has been invoked.
   */
  after?: IMiddlewareRouteHandler | IMiddlewareRouteHandler[];
}

/**
 * Default verb names used for resourceful routes.
 * This provides default names for the various routes if no custom names are provided.
 */
export const defaultVerb: ResourcefulVerb = {
  index: "index",
  create: "create",
  store: "store",
  show: "show",
  edit: "edit",
  update: "update",
  destroy: "destroy",
};

/**
 * Options for configuring resourceful routes.
 * Allows customization of route names, inclusion/exclusion of routes, and middleware handling.
 */
export interface ResourcefulOptions {
  /**
   * Whether to change route names to use the provided verb names.
   * Default is true.
   */
  changeNamesWithVerbs?: boolean;

  /**
   * Whether to create route names for create actions.
   * Default is true.
   */
  createNames?: boolean;

  /**
   * A prefix to be added to route names.
   */
  namePrefix?: string;

  /**
   * Specify which routes to include.
   * Can be a single route name or an array of route names.
   */
  only?: string[] | string;

  /**
   * Specify which routes to exclude.
   * Can be a single route name or an array of route names.
   */
  except?: string[] | string;

  /**
   * Custom verb names to use for the resourceful routes.
   */
  verb?: ResourcefulVerb;

  /**
   * Middleware functions to be executed for resourceful routes.
   */
  middleware?: ResourcefulMiddleware;
  /**
   * Whether to merge a single route middleware with the `before` middleware.
   * If `false`, the middleware for each action will be executed separately (default behavior).
   * If `true`, the middleware for the action will be combined with the `before` middleware, executed together.
   * Default is `false`.
   */
  mergeMiddleware?: boolean; // Defaults to false
}
