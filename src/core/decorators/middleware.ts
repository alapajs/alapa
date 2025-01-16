import { getClassName } from "../../utils";
import { Middleware } from "../routes";
import { ControllerClass } from "../routes/interface/controller";

export function Middlewares(handler: Middleware, ...rest: Middleware[]) {
  return function (target: ControllerClass, methodName: string) {
    // Check if 'handler' is a Function (first argument)
    if (typeof handler !== "function") {
      const className = getClassName(target);
      throw new Error(
        `The first argument "handler" in the @Middlewares decorator must be a function, but received: ${typeof handler} in method "${methodName}" of class "${className}".`
      );
    }

    // Check if all elements in 'rest' (subsequent arguments) are Functions
    for (const [index, middleware] of rest.entries()) {
      if (typeof middleware !== "function") {
        const className = getClassName(target);
        throw new Error(
          `The argument at position ${
            index + 2
          } in the @Middlewares decorator must be a function, but received: ${typeof middleware} in method "${methodName}" of class "${className}".`
        );
      }
    }

    // Define metadata if checks pass
    Reflect.defineMetadata(
      "middlewares",
      [handler, ...rest],
      target,
      methodName
    );
  };
}
