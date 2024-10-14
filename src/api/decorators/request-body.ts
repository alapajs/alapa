/* eslint-disable @typescript-eslint/no-explicit-any */
// request-body.ts
import "reflect-metadata";
import { temporalCollections } from "./entry";
// import { METHOD_KEY, ROUTE_KEY } from "./keys";
// import { openApiDefinitionsPaths } from "./entry"; // Ensure this file is correctly referenced

export function openapiRequestBody() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    // console.log(target, propertyKey, parameterIndex);

    // const route = Reflect.getMetadata(ROUTE_KEY, target, propertyKey);
    // const method = Reflect.getMetadata(METHOD_KEY, target, propertyKey);

    // if (!route || !method) {
    //   throw new Error("Route or method metadata is missing");
    // }
    if (!temporalCollections["requestBody"]) {
      temporalCollections["requestBody"] = {};
    }
    temporalCollections["requestBody"][propertyKey] = parameterIndex;
  };
}
