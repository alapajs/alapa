import { List } from "../../../interface/class";
import { AliasList } from "../../../modules/alias";
import { Logger } from "../../../utils";
import { RequestHandler } from "../interface/general";
import {
  ErrorRequestHandler,
  RequestHandler as ExpressRequestHandler,
} from "express";

export function processHandlers(
  ...handlers: (RequestHandler | ErrorRequestHandler)[]
): (ExpressRequestHandler | ErrorRequestHandler)[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newHandles = new List<any>();
  for (const handler of handlers) {
    if (typeof handler === "string") {
      const handlerFromAlias = AliasList.get(handler);
      if (handlerFromAlias) {
        newHandles.push(handlerFromAlias);
      } else {
        Logger.throw("Can not find handler from alias  for" + handler);
      }
    } else if (Array.isArray(handler)) {
      const methodName = handler[1];
      if (typeof methodName === "string") {
        const controller = new handler[0]();
        newHandles.push(controller[methodName]);
      }
    } else {
      newHandles.push(handler);
    }
  }
  return newHandles;
}
