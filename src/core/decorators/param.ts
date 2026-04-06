import "reflect-metadata";
import { getClassName } from "../../utils";
import { ControllerClass } from "../routes/interface/controller";
// Define the decorator to handle parameter metadata
export function Params(name: string, ...rest: string[]) {
  return function (target: ControllerClass, methodName: string) {
    // Check if 'name' is a string (first argument)
    if (typeof name !== "string") {
      const className = getClassName(target);
      throw new Error(
        `The first argument "name" in the @Params decorator must be a string, but received: ${typeof name} in method "${methodName}" of class "${className}".`
      );
    }

    // Check if all elements in 'rest' (subsequent arguments) are strings
    for (const [index, arg] of rest.entries()) {
      if (typeof arg !== "string") {
        const className = getClassName(target);
        throw new Error(
          `The argument at position ${
            index + 2
          } in the @Params decorator must be a string, but received: ${typeof arg} in method "${methodName}" of class "${className}".`
        );
      }
    }

    // Define metadata if checks pass
    Reflect.defineMetadata("params", [name, ...rest], target, methodName);
  };
}
