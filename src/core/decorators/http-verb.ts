import "reflect-metadata";
import { ControllerClass } from "../routes/interface/controller";
import { getClassName } from "../../utils";

function addHttpVerb(
  name: string,
  path: string,
  target: ControllerClass,
  methodName: string,
) {
  // Check if 'path' is a string
  if (typeof path !== "string") {
    const className = getClassName(target);
    throw new Error(
      `The first argument "path" in the @Get decorator must be a string, but received: ${typeof path} in method "${methodName}" of class "${className}".`,
    );
  }
  // Define metadata if checks pass
  Reflect.defineMetadata(
    "http-verb",
    { method: name, path },
    target,
    methodName,
  );
}

// Define the decorator to handle parameter metadata
export function Get(path: string) {
  return function (target: ControllerClass, methodName: string) {
    addHttpVerb("get", path, target, methodName);
  };
}

export function Post(path: string) {
  return function (target: ControllerClass, methodName: string) {
    addHttpVerb("post", path, target, methodName);
  };
}

export function Put(path: string) {
  return function (target: ControllerClass, methodName: string) {
    addHttpVerb("put", path, target, methodName);
  };
}

export function Delete(path: string) {
  return function (target: ControllerClass, methodName: string) {
    addHttpVerb("delete", path, target, methodName);
  };
}

export function Patch(path: string) {
  return function (target: ControllerClass, methodName: string) {
    addHttpVerb("patch", path, target, methodName);
  };
}

export function Options(path: string) {
  return function (target: ControllerClass, methodName: string) {
    addHttpVerb("options", path, target, methodName);
  };
}

export function Head(path: string) {
  return function (target: ControllerClass, methodName: string) {
    addHttpVerb("head", path, target, methodName);
  };
}

export function All(path: string) {
  return function (target: ControllerClass, methodName: string) {
    addHttpVerb("all", path, target, methodName);
  };
}

export function Route(path: string) {
  return function (target: ControllerClass, methodName: string) {
    addHttpVerb("route", path, target, methodName);
  };
}
