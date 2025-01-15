/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
// import { getClassName } from "../../utils";

// Define the decorator to handle parameter metadata
export function Param(...name: string[]) {
  return function (target: any, methodName: string) {
    // const className: string = getClassName(target);
    Reflect.defineMetadata("params", name, target, methodName);
  };
}
