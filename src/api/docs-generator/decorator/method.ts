/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { PathProperties } from "../interface/path";
import { OPEN_API_METHOD_KEY } from "./keys";

export function OpenApiPathMethod(pathProperties: PathProperties) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(
      OPEN_API_METHOD_KEY,
      pathProperties,
      target,
      propertyKey
    );
  };
}
