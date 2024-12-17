/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { temporalCollections } from "../builder/entry";
import { PathProperties } from "../interface/path";
type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export function OpenApiPath(route: string, properties: PathProperties) {
  return function (target: any, propertyKey: string) {
    // Ensure temporalCollections exists
    if (!temporalCollections["routes"]) {
      temporalCollections["routes"] = {};
    }

    if (!temporalCollections["routes"][route]) {
      temporalCollections["routes"][route] = {};
    }

    // Merge the provided properties into the temporal collection for the route
    Object.keys(properties).forEach((key) => {
      if (!temporalCollections["routes"][route][key]) {
        temporalCollections["routes"][route][key] = {}; // Initialize if not already present
      }

      temporalCollections["routes"][route][key] = {
        ...temporalCollections["routes"][route][key], // Preserve previous properties
        ...properties[key],
      };

      // Log to inspect the target and ensure we're dealing with the prototype
      const classConstructor = target.constructor;

      // Ensure tags exist and set them based on the class name
      if (!temporalCollections["routes"][route][key]["tags"]) {
        temporalCollections["routes"][route][key]["tags"] = [];
      }

      // Avoid overwriting existing tags; instead, add the tag if it's not already there
      const existingTags = temporalCollections["routes"][route][key]["tags"];
      if (existingTags.length == 0) {
        if (classConstructor.name !== "Function") {
          existingTags.push(classConstructor.name); // Add class name as a tag
        } else {
          existingTags.push(target.name); // Use target name if the class is a function
        }
      }
    });
  };
}
