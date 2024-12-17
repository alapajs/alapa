/* eslint-disable @typescript-eslint/no-explicit-any */

import { AnyObject } from "../../../../interface/object";
import { RequestHandler } from "../../interface/general";
import { defaultVerb, ResourcefulOptions } from "../../interface/resourceful";
import { IRouter } from "../../interface/router";

/**
 * Cleans the provided path by removing double slashes.
 * @param path - The path to clean.
 * @returns Cleaned path without double slashes.
 */
const cleanPath = (path: string): string => {
  return path.replace(/\/+/g, "/"); // Ensures no double slashes
};

/**
 * Helper function to create resourceful routes.
 * This function handles the repetitive process of route creation.
 */
const createRoute = (
  method: "get" | "post" | "put" | "patch" | "delete",
  routePath: string,
  controllerMethod: RequestHandler,
  route: IRouter,
  name: string,
  createNames: boolean,
  middleware: RequestHandler[] = []
) => {
  const routeHandler = route[method](
    cleanPath(routePath),
    ...middleware,
    controllerMethod
  );
  if (createNames) {
    routeHandler.name(name);
  }
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
  options?: ResourcefulOptions
) => {
  const controller = new controllerClass();
  options = options || {};
  if (controller.resourceOption) {
    options = { ...options, ...controller.resourceOption };
  }
  if (!options) {
    options = {};
  }
  const cleanName = (name: string): string => {
    return `${options.namePrefix || ""}${name.replace(/\/+/g, "")}`;
  };

  const verb = { ...defaultVerb, ...options.verb };
  const middleware: AnyObject = {
    ...controller.middleware,
    ...options.middleware,
  };

  const changeNamesWithVerbs =
    options.changeNamesWithVerbs !== undefined
      ? options.changeNamesWithVerbs
      : true;

  const createNames =
    options.createNames !== undefined ? options.createNames : true;

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

  /**
   * Applies middleware before and after route handler.
   * @param action - The action (index, create, etc.).
   * @returns Middleware to apply for that action.
   */
  const applyMiddleware = (action: string) => {
    let actionMiddleware = (middleware[action] || []) as
      | RequestHandler
      | RequestHandler[];
    if (!Array.isArray(actionMiddleware)) {
      actionMiddleware = [actionMiddleware];
    }
    let beforeMiddleware = (middleware.before || []) as
      | RequestHandler
      | RequestHandler[];
    if (!Array.isArray(beforeMiddleware)) {
      beforeMiddleware = [beforeMiddleware];
    }
    if (options.mergeMiddleware) {
      beforeMiddleware = [...beforeMiddleware, ...actionMiddleware];
    } else {
      beforeMiddleware = [...actionMiddleware];
    }
    let afterMiddleware = (middleware.after || []) as
      | RequestHandler
      | RequestHandler[];
    if (!Array.isArray(afterMiddleware)) {
      afterMiddleware = [afterMiddleware];
    }
    return [...beforeMiddleware, ...afterMiddleware];
  };

  // Index route
  if (
    !except.includes("index") &&
    (only.length === 0 || only.includes("index"))
  ) {
    const indexRouteName = cleanName(
      changeNamesWithVerbs ? `${path}.${verb.index}` : `${path}.index`
    );
    createRoute(
      "get",
      `/${path}`,
      controller.index,
      route,
      indexRouteName,
      createNames,
      applyMiddleware("index")
    );
  }

  // Create route
  if (
    !except.includes("create") &&
    (only.length === 0 || only.includes("create"))
  ) {
    const createRouteName = cleanName(
      changeNamesWithVerbs ? `${path}.${verb.create}` : `${path}.create`
    );
    createRoute(
      "get",
      `/${path}/${verb.create}`,
      controller.create,
      route,
      createRouteName,
      createNames,
      applyMiddleware("create")
    );
  }

  // Store route
  if (
    !except.includes("store") &&
    (only.length === 0 || only.includes("store"))
  ) {
    const storeRouteName = cleanName(
      changeNamesWithVerbs ? `${path}.${verb.store}` : `${path}.store`
    );
    createRoute(
      "post",
      `/${path}`,
      controller.store,
      route,
      storeRouteName,
      createNames,
      applyMiddleware("store")
    );
  }

  // Show route
  if (
    !except.includes("show") &&
    (only.length === 0 || only.includes("show"))
  ) {
    const showRouteName = cleanName(
      changeNamesWithVerbs ? `${path}.${verb.show}` : `${path}.show`
    );
    createRoute(
      "get",
      `/${path}/:id`,
      controller.show,
      route,
      showRouteName,
      createNames,
      applyMiddleware("show")
    );
  }

  // Edit route
  if (
    !except.includes("edit") &&
    (only.length === 0 || only.includes("edit"))
  ) {
    const editRouteName = cleanName(
      changeNamesWithVerbs ? `${path}.${verb.edit}` : `${path}.edit`
    );
    createRoute(
      "get",
      `/${path}/:id/${verb.edit}`,
      controller.edit,
      route,
      editRouteName,
      createNames,
      applyMiddleware("edit")
    );
  }

  // Update routes
  if (
    !except.includes("update") &&
    (only.length === 0 || only.includes("update"))
  ) {
    const updateRouteName = cleanName(
      changeNamesWithVerbs ? `${path}.${verb.update}` : `${path}.update`
    );
    createRoute(
      "put",
      `/${path}/:id`,
      controller.update,
      route,
      updateRouteName,
      createNames,
      applyMiddleware("update")
    );
    createRoute(
      "patch",
      `/${path}/:id`,
      controller.update,
      route,
      updateRouteName,
      createNames,
      applyMiddleware("update")
    );
  }

  // Destroy route
  if (
    !except.includes("destroy") &&
    (only.length === 0 || only.includes("destroy"))
  ) {
    const destroyRouteName = cleanName(
      changeNamesWithVerbs ? `${path}.${verb.destroy}` : `${path}.destroy`
    );
    createRoute(
      "delete",
      `/${path}/:id`,
      controller.destroy,
      route,
      destroyRouteName,
      createNames,
      applyMiddleware("destroy")
    );
  }
};
