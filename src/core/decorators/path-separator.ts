import "reflect-metadata";
import { getClassName } from "../../utils";
import { ControllerClass } from "../routes/interface/controller";

export function PathSeparator(separator: string) {
  return function (target: ControllerClass, methodName: string) {
    if (!separator) {
      const className = getClassName(target);
      throw new Error(
        `A Separator must be provided in method "${methodName}" of class "${className}".`
      );
    }
    if (typeof separator !== "string") {
      const className = getClassName(target);
      throw new Error(
        `Invalid type for "separator" argument in the @PathSeparator decorator. Expected a string but received ${typeof separator}. Method: "${methodName}" in class: "${className}".`
      );
    }
    Reflect.defineMetadata("path-separator", separator, target, methodName);
  };
}
