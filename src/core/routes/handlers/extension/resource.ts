/* eslint-disable @typescript-eslint/no-explicit-any */

import { IRouter } from "../../interface/router";

/**
 * Defines the custom verb names for resourceful routes.
 */
export interface ResourceVerb {
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
 * Default verb names used for resourceful routes.
 */
const defaultVerb: ResourceVerb = {
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
 */
export interface ResourceOptions {
  /**
   * Whether to change route names to use the provided verb names.
   * Default is true.
   */
  changeNamesWithVerbs?: boolean;

  /**
   * Whether create route names.
   * Default is true.
   */
  createNames?: boolean;

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
  verb?: ResourceVerb;
}

/**
 * Cleans the provided path by removing double slashes.
 * @param path - The path to clean.
 * @returns Cleaned path without double slashes.
 */
const cleanPath = (path: string): string => {
  return path.replace(/\/+/g, "/"); // Ensures no double slashes
};

/**
 * Creates resourceful routes for a given controller.
 *
 * @param path - The base path for the resource.
 * @param controllerClass - The controller class to handle requests.
 * @param route - The router instance to attach the routes to.
 * @param options - Options for configuring the routes.
 */
export const makeResourcefulRoute = (
  path: string,
  controllerClass: any,
  route: IRouter,
  options?: ResourceOptions
) => {
  const controller = new controllerClass();
  options = options || {};
  if (controller.resourceOption) {
    options = { ...options, ...controller.resourceOption };
  }
  if (options === undefined) {
    options = {};
  }
  const cleanName = (name: string): string => {
    return `${options.namePrefix || ""}${name.replace(/\/+/g, "")}`; // Ensures no double slashes
  };

  const verb = { ...defaultVerb, ...options.verb }; // Merge provided verbs with defaults
  const changeNamesWithVerbs =
    options.changeNamesWithVerbs !== undefined
      ? options.changeNamesWithVerbs
      : true; // Default to true

  const createNames =
    options.createNames !== undefined ? options.createNames : true; // Default to true

  const only: string[] = Array.isArray(options.only)
    ? options.only
    : typeof options.only === "string"
    ? [options.only]
    : [];

  const except: string[] = Array.isArray(options.except)
    ? options.except
    : typeof options.except === "string"
    ? [options.except]
    : [];

  // Index route
  if (
    !except.includes("index") &&
    (only.length === 0 || only.includes("index"))
  ) {
    const indexRoute = route.get(cleanPath(`/${path}`), controller.index);
    if (createNames) {
      indexRoute.name(
        cleanName(
          changeNamesWithVerbs ? `${path}.${verb.index}` : `${path}.index`
        )
      );
    }
  }

  // Create route
  if (
    !except.includes("create") &&
    (only.length === 0 || only.includes("create"))
  ) {
    const createRoute = route.get(
      cleanPath(`/${path}/${verb.create}`),
      controller.create
    );
    if (createNames) {
      createRoute.name(
        cleanName(
          changeNamesWithVerbs ? `${path}.${verb.create}` : `${path}.create`
        )
      );
    }
  }

  // Store route
  if (
    !except.includes("store") &&
    (only.length === 0 || only.includes("store"))
  ) {
    const storeRoute = route.post(cleanPath(`/${path}`), controller.store);
    if (createNames) {
      storeRoute.name(
        cleanName(
          changeNamesWithVerbs ? `${path}.${verb.store}` : `${path}.store`
        )
      );
    }
  }

  // Show route
  if (
    !except.includes("show") &&
    (only.length === 0 || only.includes("show"))
  ) {
    const showRoute = route.get(cleanPath(`/${path}/:id`), controller.show);
    if (createNames) {
      showRoute.name(
        cleanName(
          changeNamesWithVerbs ? `${path}.${verb.show}` : `${path}.show`
        )
      );
    }
  }

  // Edit route
  if (
    !except.includes("edit") &&
    (only.length === 0 || only.includes("edit"))
  ) {
    const editRoute = route.get(
      cleanPath(`/${path}/:id/${verb.edit}`),
      controller.edit
    );
    if (createNames) {
      editRoute.name(
        cleanName(
          changeNamesWithVerbs ? `${path}.${verb.edit}` : `${path}.edit`
        )
      );
    }
  }

  // Update routes
  if (
    !except.includes("update") &&
    (only.length === 0 || only.includes("update"))
  ) {
    const updateRoutePut = route.put(
      cleanPath(`/${path}/:id`),
      controller.update
    );
    if (createNames) {
      updateRoutePut.name(
        cleanName(
          changeNamesWithVerbs ? `${path}.${verb.update}` : `${path}.update`
        )
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateRoutePatch = route.patch(
      cleanPath(`/${path}/:id`),
      controller.update
    );
  }

  if (
    !except.includes("destroy") &&
    (only.length === 0 || only.includes("destroy"))
  ) {
    const editRoute = route.delete(
      cleanPath(`/${path}/:id`),
      controller.destroy
    );
    if (createNames) {
      editRoute.name(
        cleanName(
          changeNamesWithVerbs ? `${path}.${verb.destroy}` : `${path}.destroy`
        )
      );
    }
  }
};
