import { List } from "../../../interface/class";
import { AliasList } from "../../../modules/alias";
import { Logger } from "../../../utils";
import { RequestHandler } from "../interface/general";
import {
  ErrorRequestHandler,
  RequestHandler as ExpressRequestHandler,
} from "express";
import { SingleControllerClassHandler } from "./extension/single-controller";

export function processHandlers(
  ...handlers: (RequestHandler | ErrorRequestHandler)[]
): (ExpressRequestHandler | ErrorRequestHandler)[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newHandles = new List<any>();
  for (const handler of handlers) {
    if (typeof handler === "string") {
      if (handler.includes("@")) {
        // const atHandler =
        // SingleControllerClassHandler.parseRouteHandlerWithAtSymbol(handler);
        // newHandles.push(processHandlers(atHandler));
      } else {
        const handlerFromAlias = AliasList.get(handler);
        if (handlerFromAlias) {
          newHandles.push(handlerFromAlias);
        } else {
          Logger.throw("Can not find handler from alias  for" + handler);
        }
      }
    } else if (Array.isArray(handler)) {
      const arrayHandler =
        SingleControllerClassHandler.parseRouteHandlerFromArray(handler);
      newHandles.push(processHandlers(arrayHandler));
    } else {
      newHandles.push(handler);
    }
  }
  return newHandles;
}
