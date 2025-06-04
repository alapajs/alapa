import "reflect-metadata";
import { getClassName } from "../../utils";
import { ControllerClass } from "../routes/interface/controller";

export function RouteNameSuffix(name: string) {
  return function (target: ControllerClass, methodName: string) {
    if (!name) {
      const className = getClassName(target);
      throw new Error(
        `A name prefix must be provided in method "${methodName}" of class "${className}".`
      );
    }
    if (typeof name !== "string") {
      const className = getClassName(target);
      throw new Error(
        `Invalid type for "name" argument in the @NamePrefix decorator. Expected a string but received ${typeof name}. Method: "${methodName}" in class: "${className}".`
      );
    }
    Reflect.defineMetadata("route-name-suffix", name, target, methodName);
  };
}
