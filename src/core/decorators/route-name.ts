import "reflect-metadata";
import { getClassName } from "../../utils";
import { ControllerClass } from "../routes/interface/controller";
// Define the decorator to handle parameter metadata
export function SetRouteName(name: string) {
  return function (target: ControllerClass, methodName: string) {
    // Check if 'name' is a string (first argument)
    if (typeof name !== "string") {
      const className = getClassName(target);
      throw new Error(
        `The first argument "name" in the @RouteName decorator must be a string, but received: ${typeof name} in method "${methodName}" of class "${className}".`,
      );
    }
    // Define metadata if checks pass
    Reflect.defineMetadata("routeName", name, target, methodName);
  };
}
