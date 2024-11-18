/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import { temporalCollections } from "./entry";
import { PathProperties } from "../../interface/open-api/response-body";
type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export function OpenApiPath(route: string, properties: PathProperties) {
  return function (target: any, propertyKey: string) {
    // Ensure temporalCollections exists
    if (!temporalCollections["routes"]) {
      temporalCollections["routes"] = {};
    }
    if (!temporalCollections["generalTags"]) {
      temporalCollections["generalTags"] = {};
    }

    if (!temporalCollections["routes"][route]) {
      temporalCollections["routes"][route] = {};
    }

    // Merge the provided properties into the temporal collection for the route
    Object.keys(properties).forEach((key) => {
      temporalCollections["routes"][route][key] = properties[key];
    });

    // Log to inspect the target and ensure we're dealing with the prototype

    // Access the class constructor from the prototype
    const classConstructor = target.constructor;

    // Check if the class constructor (i.e., the class itself) has openApiTags
    if (classConstructor.openApiTags) {
      temporalCollections["generalTags"][route] = classConstructor.openApiTags;
    } else {
      if (classConstructor.name != "Function") {
        temporalCollections["generalTags"][route] = classConstructor.name;
      } else if (classConstructor.name == "Function") {
        temporalCollections["generalTags"][route] = target.name;
      }
    }
  };
}
