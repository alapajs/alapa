/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRouter } from "../../interface/router";
import "reflect-metadata";
import { container } from "tsyringe";
import { ControllerClass, ControllerOptions } from "../../interface/controller";
import {
  getClassName,
  isClass,
  normalizeURLPath,
} from "../../../../utils/mics";
import { HTTP_METHODS } from "../../../../shared/constant/http";
import { ControllerDocGenerator } from "./controller-docs";
import { OpenApiEntry } from "../../../../api";
import { GlobalConfig } from "../../../../shared/globals";
import { Middleware } from "../../interface";
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

export class ControllerRoutes {
  private methods: string[] = [];
  private options?: ControllerOptions;
  private controllerClass: any;
  private className = "";
  private route: IRouter;
  private path: string = "";
  private docPrefix: string;
  private controller: any;
  private verbs: string[] = Object.keys(HTTP_METHODS);
  private controllerDoc: ControllerDocGenerator;

  constructor(
    route: IRouter,
    path: string | ControllerClass,
    controllerClass?: ControllerClass,
    options?: ControllerOptions,
  ) {
    this.buildData(route, path, controllerClass, options);
    this.getMethods();
    this.addRoutes();
  }

  buildData(
    route: IRouter,
    path: string | ControllerClass,
    controllerClass?: ControllerClass,
    options?: ControllerOptions,
  ) {
    if (typeof path === "string") {
      this.path = normalizeURLPath(path);
    } else if (isClass(path)) {
      this.controller = container.resolve<any>(path);
      this.controllerClass = path;
    }
    if (!this.controller) {
      if (isClass(controllerClass)) {
        this.controller = container.resolve<any>(controllerClass);
        this.controllerClass = controllerClass;
      } else {
        throw new Error("Invalid controller");
      }
    }
    this.route = route;
    this.options = options;
    this.className = getClassName(this.controllerClass);
    this.docPrefix =
      this.controller.docPrefix ||
      this.controllerClass.docPrefix ||
      GlobalConfig?.api?.docs?.docPrefix;
    if (this.docPrefix == null) {
      this.docPrefix = "api";
    }
    this.controllerDoc = new ControllerDocGenerator({
      defaultTag: this.className,
      docPrefix: this.docPrefix,
    });
  }
  generateDoc(path: string, name: string, verb: string) {
    const operation = OpenApiEntry.getOperationItem(this.controller, name);
    const methodItem = OpenApiEntry.getMethodItem(this.controller, name);
    if (methodItem) {
      this.controllerDoc.generateMethod(path, methodItem);
    }
    if (operation) {
      this.controllerDoc.generateOperation(path, verb, operation);
    }
  }
  private addRoutes() {
    if (!this.methods.length) {
      this.getMethods();
    }
    if (!this.controller) {
      throw new Error("Controller is not defined");
    }
    const methods = this.methods;
    const path = this.path;
    const route: any = this.route;
    const controller = this.controller;
    for (const name of methods) {
      if (!this.isRouteMethodFormat(name)) continue;
      const names = this.splitCamelCase(name);
      const httpVerb = Reflect.getMetadata("http-verb", controller, name);

      let verb = names[0].toLowerCase();
      if (httpVerb) {
        verb = httpVerb.method;
      }
      if (!this.verbs.includes(verb)) continue;

      let routeName = this.generateRouteName(names, name);
      const routeNameDecorator = Reflect.getMetadata(
        "routeName",
        controller,
        name,
      );
      if (routeNameDecorator) {
        routeName = routeNameDecorator;
      }
      const params = Reflect.getMetadata("params", controller, name) || [];
      const paramsString = this.buildParams(params);
      const methodPath = this.getMethodPaths(names, params, name);
      let routePath = "/" + `${path}/${methodPath}${paramsString}`;
      if (httpVerb) {
        routePath = "/" + `${path}/${httpVerb.path}${paramsString}`;
      }
      routePath = normalizeURLPath(routePath);
      this.generateDoc(routePath, name, verb);
      const middleware = this.getMiddleware(name);
      route[verb](
        routePath,
        ...middleware,
        controller[name].bind(controller),
      ).name(routeName);
    }
  }
  private getMiddleware(name: string): Middleware[] {
    const allMiddlewares = this.options?.middlewareAll || [];
    const decoratorMiddleware =
      Reflect.getMetadata("middlewares", this.controller, name) || [];
    const middleware = this.options?.middleware || {};
    const specificMiddleware = middleware[name] || [];
    return [...decoratorMiddleware, ...specificMiddleware, ...allMiddlewares];
  }
  private getMethodPaths(
    names: string[],
    params: string[],
    methodName: string,
  ) {
    const separator =
      Reflect.getMetadata("path-separator", this.controller, methodName) || "/";
    let methodPath = names.slice(1).join(separator).toLowerCase();
    if (methodPath === "index") {
      methodPath = "";
    }
    // console.log("methodPath", methodPath);
    return methodPath;
  }

  private generateRouteName(names: string[], methodName: string): string {
    let namePrefix =
      this.options?.namePrefix || this.getPathPrefix(this.path) || "";
    if (namePrefix && namePrefix.length > 0) {
      namePrefix += ".";
    }
    let nameSuffix =
      Reflect.getMetadata("route-name-suffix", this.controller, methodName) ||
      "";
    if (nameSuffix && nameSuffix.length > 0) {
      nameSuffix = "." + nameSuffix;
    }

    return `${namePrefix}${names.slice(1).join(".")}${nameSuffix}`.toLowerCase();
  }
  private buildParams(params: string[]): string {
    if (!params.length) return "";
    const result = [];
    for (const param of params) {
      result.push(`:${param}`);
    }
    return "/" + result.join("/");
  }

  private getPathPrefix(path: string): string {
    // Remove dynamic segments and normalize the path
    const segments = path.split("/").filter(Boolean);
    return segments
      .map((segment) => (segment.startsWith(":") ? "" : segment))
      .join(".")
      .toLowerCase();
  }

  private splitCamelCase(str: string): string[] {
    str = str.replaceAll("_", "");
    return str.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(" ");
  }

  private isRouteMethodFormat(name: string): boolean {
    return /^[a-zA-Z0-9_]+$/.test(name);
  }

  private getMethods() {
    if (this.methods.length) return;
    if (!this.controller) {
      throw new Error("Controller is not defined");
    }
    const propertyTypes = this.getObjectPropertiesTypes(this.controller);
    this.methods = Object.keys(propertyTypes).filter((key) => {
      const type = propertyTypes[key];
      if (type === "function" && !excludedMethods.includes(key)) {
        return key;
      }
    });
  }

  getObjectPropertiesTypes(obj: any): { [key: string]: string } {
    this.className = getClassName(obj);
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
}
