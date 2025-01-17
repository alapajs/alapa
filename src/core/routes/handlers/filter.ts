import { AliasList } from "../../../modules/alias";
import { SingleControllerClassHandler } from "./extension/single-controller";
import {
  BasicRequestHandler,
  Middleware,
  ErrorRequestHandler,
  RequestHandler,
} from "../interface/handler";
import { IRouter } from "../interface";
import { Router } from ".";
interface FilteredRoute {
  processed: (BasicRequestHandler | ErrorRequestHandler)[];
  routers: IRouter[];
}
export class RouteFilter {
  getAlias(value: string): RequestHandler | Middleware | null {
    if (typeof value !== "string") {
      throw new Error("Not a string");
    }
    const alias = AliasList.get(value);
    if (!alias) {
      return null;
    }
    return alias;
  }
  // filterAlias(alias):FilteredRoute{

  // }

  filter(handler: RequestHandler | Middleware) {
    let processed: BasicRequestHandler | ErrorRequestHandler | null = null;
    let router: IRouter | null = null;
    if (handler instanceof Router) {
      router = handler;
    } else if (typeof handler === "function") {
      processed = handler;
    } else if (typeof handler === "string") {
      if (handler.includes("@")) {
        // SingleControllerClassHandler.parseRouteHandlerWithAtSymbol(handler)
      } else {
        const alias = this.getAlias(handler);
        if (alias) {
          //  processed = alias;
        }
      }
    } else if (Array.isArray(handler)) {
      processed =
        SingleControllerClassHandler.parseRouteHandlerFromArray(handler);
    }
    return {
      router,
      processed,
    };
  }
  handlers(...handlers: RequestHandler[]) {
    const filter = this.filterMultiple(...handlers);
    return filter;
  }

  middlewares(...middlewares: Middleware[]) {
    const filter = this.filterMultiple(...middlewares);
    return filter;
  }

  filterMultiple(
    ...middlewares: (Middleware | RequestHandler)[]
  ): FilteredRoute {
    const processed: (BasicRequestHandler | ErrorRequestHandler)[] = [];
    const routers: IRouter[] = [];
    for (const handler of middlewares) {
      const filter = this.filter(handler);
      if (filter.processed) {
        processed.push(filter.processed);
      }
      if (filter.router) {
        routers.push(filter.router);
      }
    }
    return {
      processed,
      routers,
    };
  }
}
