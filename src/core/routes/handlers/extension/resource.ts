/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject } from "../../../../interface/object";
import { cleanPath, getClassName, isClass } from "../../../../utils";
import { ControllerClass } from "../../interface/controller";
import { RequestHandler } from "../../interface/handler";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const inflect = require("i")();
import {
  defaultVerb,
  ResourcefulOptions,
  ResourcefulVerb,
} from "../../interface/resourceful";
import { IRouter } from "../../interface/router";
import "reflect-metadata";
import { container } from "tsyringe";
import { ControllerDocGenerator } from "./controller-docs";
import { OpenApiEntry } from "../../../../api";

interface ResourcefulActions {
  name: string;
  method: string | string[];
}
interface RouteCallbackMiddleware {
  before: RequestHandler[];
  after: RequestHandler[];
}

export class ResourcefulRoute {
  private middlewares: AnyObject = {};
  private changeNamesWithVerbs: boolean = false;
  private createNames: boolean = true;
  private verbs: ResourcefulVerb = defaultVerb;
  private only: string[] = [];
  private except: string[] = [];
  private controller: ControllerClass;
  private path: string;
  private controllerDoc: ControllerDocGenerator;
  private className: string;
  private docPrefix: string;

  constructor(
    path: string,
    private controllerClass: ControllerClass,
    private router: IRouter,
    private options?: ResourcefulOptions
  ) {
    this.path = cleanPath(path);
    this.buildData();
    this.make();
  }

  private generateRouteName(name: string): string {
    let verbName = name;
    if (this.changeNamesWithVerbs) {
      verbName = (this.verbs as any)[name];
    }
    name = `${this.options?.namePrefix || ""}${this.path.replace(
      /\/+/g,
      "."
    )}.${verbName}`;
    return name.toLowerCase();
  }

  generateDoc(name: string, method: string) {
    const path = this.getRoutePath(name);
    const operation = OpenApiEntry.getOperationItem(this.controller, name);
    const methodItem = OpenApiEntry.getMethodItem(this.controller, name);
    this.controllerDoc.generateMethod(path, methodItem);
    this.controllerDoc.generateOperation(path, method, operation);
  }

  private createRoute(action: ResourcefulActions) {
    const { name } = action;
    if (this.isInclude(name)) {
      const middleware = this.getMiddleware(name);
      const path = this.getRoutePath(name);
      const controllerMethod = this.controller[name].bind(this.controller);
      const methods = this.getMethods(action.method);
      this.generateDoc(name, methods[0]);
      for (const method of methods) {
        if (middleware.before.length > 0) {
          this.router.use(path, ...middleware.before);
        }
        const handler = (this.router as any)[method](path, controllerMethod);
        if (middleware.after.length > 0) {
          this.router.use(path, ...middleware.after);
        }
        this.addName(handler, name, method);
      }
    }
  }

  private addName(handler: any, name: string, method: string) {
    if (method === "patch") return;
    if (this.createNames) {
      handler.name(this.generateRouteName(name));
    }
  }

  isInclude(name: string): boolean {
    return (
      !this.except.includes(name) &&
      (this.only.length === 0 || this.only.includes(name))
    );
  }

  getMethods(method: string | string[]): string[] {
    return typeof method === "string" ? [method] : method;
  }

  private getRoutePath(name: string): string {
    const path = this.generatePath(name);
    return path;
  }

  private pathFormat(): ResourcefulVerb {
    const firstWord = this.path.match(/^\w+/)?.[0] || "id";
    const id = this.options?.paramNames || inflect.singularize(firstWord);
    return {
      index: "/",
      create: `/${this.verbs.create}`,
      store: "/",
      show: `/:${id}`,
      edit: `/:${id}/${this.verbs.edit}`,
      update: `/:${id}`,
      destroy: `/:${id}`,
    };
  }

  private generatePath(name: string): string {
    let path = `${this.path}/${(this.pathFormat() as any)[name]}`;
    path = `${path}/${this.getParam(name)}`;
    path = cleanPath(path);
    return path;
  }

  getParam(name: string): string {
    const params = Reflect.getMetadata("params", this.controller, name) || [];
    if (!params.length) return "";
    const result = [];
    for (const param of params) {
      result.push(`:${param}`);
    }
    return cleanPath("/" + result.join("/"));
  }

  make() {
    const actions: ResourcefulActions[] = [
      { name: "index", method: "get" },
      { name: "create", method: "get" },
      { name: "store", method: "post" },
      { name: "show", method: "get" },
      { name: "edit", method: "get" },
      { name: "update", method: ["put", "patch"] },
      { name: "destroy", method: "delete" },
    ];

    actions.forEach((action) => {
      try {
        this.createRoute(action);
      } catch (err: any) {
        throw new Error(
          `Error creating route for action "${action.name}": ${err.message}`
        );
      }
    });
  }

  private buildData() {
    try {
      this.buildGeneral();
      this.buildIncludes();
      this.buildVerbs();
    } catch (err: any) {
      throw new Error("Error building resourceful route data: " + err.message);
    }
  }

  buildGeneral() {
    if (!isClass(this.controllerClass)) {
      throw new Error(
        "Resourceful controller requires a class, but a " +
          typeof this.controllerClass +
          " was provided."
      );
    }
    try {
      this.controller = container.resolve<any>(this.controllerClass);
    } catch (err: any) {
      throw new Error("Error resolving controller instance: " + err.message);
    }

    if (!this.controller) {
      throw new Error("Controller instance could not be created.");
    }
    this.docPrefix =
      this.controller.docPrefix || this.controllerClass.docPrefix;
    this.className = getClassName(this.controllerClass);
    this.controllerDoc = new ControllerDocGenerator({
      defaultTag: this.className,
      docPrefix: this.docPrefix,
    });

    this.options = { ...this.options, ...this.controller.resourceOption };
    this.changeNamesWithVerbs =
      this.options?.changeNamesWithVerbs !== undefined
        ? this.options.changeNamesWithVerbs
        : true;
    this.createNames =
      this.options?.createNames !== undefined ? this.options.createNames : true;
  }

  buildIncludes() {
    if (
      this.options?.only &&
      !Array.isArray(this.options?.only) &&
      typeof this.options?.only !== "string"
    ) {
      throw new Error("The 'only' option must be an array or string.");
    }
    this.only = Array.isArray(this.options?.only)
      ? this.options?.only
      : typeof this.options?.only === "string"
        ? [this.options.only]
        : [];

    if (
      this.options?.except &&
      !Array.isArray(this.options?.except) &&
      typeof this.options?.except !== "string"
    ) {
      throw new Error("The 'except' option must be an array or string.");
    }
    this.except = Array.isArray(this.options?.except)
      ? this.options.except
      : typeof this.options?.except === "string"
        ? [this.options.except]
        : [];
  }

  buildVerbs() {
    if (this.options?.verb && typeof this.options?.verb !== "object") {
      throw new Error("The 'verb' option must be an object.");
    }
    this.verbs = { ...defaultVerb, ...this.options?.verb };
    if (
      this.controller.middleware &&
      typeof this.controller.middleware !== "object"
    ) {
      throw new Error("Controller middleware must be an object.");
    }
    this.middlewares = {
      ...this.controller.middleware,
      ...this.options?.middleware,
    };
  }

  private getMiddleware(name: string): RouteCallbackMiddleware {
    let actionMiddleware = (this.middlewares[name] || []) as RequestHandler[];
    if (!Array.isArray(actionMiddleware)) actionMiddleware = [actionMiddleware];

    let beforeMiddleware = (this.middlewares.before || []) as RequestHandler[];
    if (!Array.isArray(beforeMiddleware)) beforeMiddleware = [beforeMiddleware];

    if (this.options?.mergeMiddleware) {
      beforeMiddleware = [...beforeMiddleware, ...actionMiddleware];
    } else {
      beforeMiddleware = [...actionMiddleware];
    }
    const decoratorMiddleware =
      Reflect.getMetadata("middleware", this.controller, name) || [];

    beforeMiddleware = [...beforeMiddleware, ...decoratorMiddleware];
    let afterMiddleware = (this.middlewares.after || []) as RequestHandler[];
    if (!Array.isArray(afterMiddleware)) afterMiddleware = [afterMiddleware];

    return { before: beforeMiddleware, after: afterMiddleware };
  }
}
