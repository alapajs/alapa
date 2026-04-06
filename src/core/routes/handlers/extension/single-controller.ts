/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { container } from "tsyringe";
import { ControllerClass } from "../../interface/controller";
import { getClassName, isClass } from "../../../../utils";
import path from "path";
import {
  BasicRequestHandler,
  ErrorRequestHandler,
} from "../../interface/handler";

export class SingleControllerClassHandler {
  static parseRouteHandlerFromArray(handle: [ControllerClass, string]) {
    if (!Array.isArray(handle)) {
      throw new Error(
        `'${handle}' is not a valid handler. Expected format: [ControllerClass, methodName]`
      );
    }
    if (handle.length !== 2) {
      throw new Error(
        `'${handle}' is not a valid handler. Expected format: [ControllerClass, methodName]`
      );
    }
    const classController = handle[0];
    const method = handle[1];
    return this.parse(classController, method);
  }
  // static parseRouteHandlerFromClassName(controllerName: string, method: string) {}

  static async resolveImports(filePath: string) {
    const file = path.resolve(filePath);
    const modules = await import(file);
    return modules;
  }

  static async parseRouteHandlerWithAtSymbol(handler: string) {
    if (typeof handler !== "string") {
      throw new Error(
        `'${handler}' is not a valid handler. Expected format: 'ControllerName@methodName'`
      );
    }
    if (handler.includes("@")) {
      const handlerParts = handler.split("@");
      const modules = await this.resolveImports("dist/apps/index.js");
      // console.log(modules);
      const controllerName = (modules as any)[handlerParts[0]];
      if (controllerName) {
        throw new Error(controllerName + " is not found in as module");
      }
      const method = handlerParts[1];
      // console.log(controllerName, method);
      return this.parseRouteHandlerFromArray([controllerName, method]);
    } else {
      throw new Error(
        `'${handler}' is not a valid handler. Expected format: 'ControllerName@methodName'`
      );
    }
  }
  static parse(
    classController: ControllerClass,
    method: string
  ): BasicRequestHandler | ErrorRequestHandler {
    if (!isClass(classController)) {
      throw new Error(`${typeof classController} is not a valid class`);
    }
    const controller = container.resolve<ControllerClass>(classController); // Resolve the controller instance using tsyringe
    // Check if method exists on the controller instance
    const instanceMethod = controller[method];
    if (instanceMethod) {
      return instanceMethod.bind(controller); // Bind instance method to the controller instance
    }

    // Check if method exists on the class (static method)
    const staticMethod = classController[method];
    if (staticMethod) {
      return staticMethod.bind(classController); // Bind static method to the class
    }

    // If method doesn't exist, throw a descriptive error
    throw new Error(
      `Method "${method}" not found in class "${getClassName(
        classController
      )}" or its parent classes`
    );
  }
}
