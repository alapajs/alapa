/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { OpenApiEntry } from "../builder/entry";
import { getClassName } from "../../../utils";
import { PathItem } from "swagger-jsdoc";

export function OpenApiPath(path: string, item: PathItem) {
  return function (target: any, propertyKey: string) {
    const classObject = target.constructor;
    const className = getClassName(target);

    const prefix = target.docPrefix || classObject.docPrefix;

    if (prefix) {
      path = prefix + "/" + path;
    }

    OpenApiEntry.add(path, item, className);
  };
}
