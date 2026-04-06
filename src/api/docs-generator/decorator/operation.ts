/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { OPEN_API_OPERATION_KEY } from "./keys";
import { Operation } from "swagger-jsdoc";

export function OpenApiOperation(operation: Operation) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(
      OPEN_API_OPERATION_KEY,
      operation,
      target,
      propertyKey
    );
  };
}
