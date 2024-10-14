/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRouter } from "../../interface/router";
const excludedMethods = [
  "constructor",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toString",
  "toLocaleString",
  "valueOf",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__",
];

function getObjectPropertiesTypes(obj: any): { [key: string]: string } {
  const types: { [key: string]: string } = {};
  while (obj !== null) {
    const properties = [];
    properties.push(...Object.getOwnPropertyNames(obj));
    for (const property of properties) {
      types[property] = typeof obj[property];
    }
    obj = Object.getPrototypeOf(obj);
  }
  return types;
}

export class ControllerRoutes {
  private methodStructure = {
    get: "/",
    show: "/:id",
    update: "/:id",
    destroy: "/:id",
    create: "/",
    index: "/",
    edit: "/:id/edit",
  };

  static make = (path: string, controllerClass: any, route: IRouter) => {
    const controller = new controllerClass(); // Create an instance of the controller

    const propertyTypes = getObjectPropertiesTypes(controller);
    const methods: string[] = Object.keys(propertyTypes).filter((key) => {
      const type = propertyTypes[key];
      if (type === "function" && !excludedMethods.includes(key)) {
        return key;
      }
    });
    for (const name of methods) {
      if (name.startsWith("show")) {
        route["get"](`/${path}/:id`, controller[name]);
      }
    }
  };
}
