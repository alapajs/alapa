/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import { temporalCollections } from "./entry";
import { METHOD_KEY, ROUTE_KEY } from "./keys";
import { json } from "body-parser";
type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export function OpenApiMethod(route: string, method: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(ROUTE_KEY, route, target, propertyKey);
    Reflect.defineMetadata(METHOD_KEY, method, target, propertyKey);
    console.log(target, propertyKey); // property instead of propertyKey

    temporalCollections["objects"].push(propertyKey);

    if (!temporalCollections["routes"]) {
      temporalCollections["routes"] = {};
    }
    temporalCollections["routes"][propertyKey] = route;

    if (!temporalCollections["methods"]) {
      temporalCollections["methods"] = {};
    }
    temporalCollections["methods"][propertyKey] = method;
  };
}

export const openapiGet = (route: string) => OpenApiMethod(route, "get");
export const openapiPost = (route: string) => OpenApiMethod(route, "post");
export const openapiPut = (route: string) => OpenApiMethod(route, "put");
export const openapiDelete = (route: string) => OpenApiMethod(route, "delete");
export const openapiPatch = (route: string) => OpenApiMethod(route, "patch");
export const openapiOptions = (route: string) =>
  OpenApiMethod(route, "options");
export const openapiHead = (route: string) => OpenApiMethod(route, "head");
