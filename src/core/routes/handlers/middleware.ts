import { RequestHandler } from "../interface/general";
import { IRouter } from "../interface/router";
import { Router } from ".";
import { ErrorRequestHandler, Router as ExpressRouter } from "express";
import { processHandlers } from "./processor";
import { AliasList } from "../../../modules/alias";
import { SingleControllerClassHandler } from "./extension/single-controller";

export class MiddlewareRouteHandler {
  public processUse(
    pathOrHandler:
      | string
      | RequestHandler
      | ErrorRequestHandler
      | ExpressRouter
      | IRouter,
    ...handlers: (
      | RequestHandler
      | ExpressRouter
      | IRouter
      | ErrorRequestHandler
    )[]
  ) {
    const routers: IRouter[] = [];
    const processed: (RequestHandler | ErrorRequestHandler)[] = [];
    let path: string | null = null;

    // Helper function to process handlers
    const handleHandler = (
      handler: RequestHandler | ExpressRouter | IRouter | ErrorRequestHandler
    ) => {
      if (handler instanceof Router) {
        routers.push(handler);
      } else if (typeof handler === "function") {
        processed.push(handler);
      } else {
        processed.push(...processHandlers(handler as RequestHandler));
      }
    };

    // Process the handlers array
    handlers.forEach(handleHandler);

    // Determine path or handler type
    if (pathOrHandler instanceof Router) {
      routers.push(pathOrHandler);
    } else if (typeof pathOrHandler === "function") {
      processed.push(pathOrHandler);
    } else if (typeof pathOrHandler === "string") {
      const handlerFromAlias = AliasList.get(pathOrHandler);
      if (!handlerFromAlias) {
        path = pathOrHandler; // Set path if no alias found
      } else {
        processed.push(handlerFromAlias);
      }
    } else {
      processed.push(...processHandlers(pathOrHandler as RequestHandler));
    }

    return {
      path,
      routers,
      processed,
    };
  }
}
