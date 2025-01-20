/* eslint-disable @typescript-eslint/no-explicit-any */
import { Operation, PathItem } from "swagger-jsdoc";
import { cleanPath } from "../../../utils";
import { OPEN_API_METHOD_KEY, OPEN_API_OPERATION_KEY } from "../decorator/keys";

interface IOpenApiDefinitionsPaths {
  [key: string]: {
    [key: string]: any; // Adjust the type as needed
  };
}

/* eslint-disable prefer-const */
export let openApiDefinitionsPaths: IOpenApiDefinitionsPaths = {};

export const temporalCollections: {
  [key: string]: any;
} = {};

export class OpenApiEntry {
  static add(path: string, item: PathItem, defaultTag?: string) {
    // Ensure temporalCollections exists
    if (!temporalCollections["routes"]) {
      temporalCollections["routes"] = {};
    }

    if (!temporalCollections["routes"][path]) {
      temporalCollections["routes"][path] = {};
    }

    Object.keys(item).forEach((key) => {
      if (!temporalCollections["routes"][path][key]) {
        temporalCollections["routes"][path][key] = item[key];
      }
      if (!temporalCollections["routes"][path][key]["tags"]) {
        temporalCollections["routes"][path][key]["tags"] = [defaultTag];
      }
    });
  }
  static getItem(key: any, target: any, propertyKey: string | symbol) {
    const item = Reflect.getMetadata(key, target, propertyKey);
    if (!item) {
      return null;
    }
    return item;
  }

  static buildPath(path: string) {
    path = "/" + cleanPath(path);
    const regex = /\/:([a-zA-Z0-9_]+)/g;
    return path.replace(regex, "/{$1}");
  }

  static getMethodItem(target: any, key: string | symbol) {
    const item = this.getItem(OPEN_API_METHOD_KEY, target, key);
    if (!item) {
      return null;
    }
    return item as PathItem;
  }
  static getOperationItem(target: any, key: string | symbol) {
    const item = this.getItem(OPEN_API_OPERATION_KEY, target, key);
    if (!item) {
      return null;
    }
    return item as Operation;
  }
}
