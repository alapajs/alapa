/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ControllerClass } from "./controller";
import { IRouter } from "./router";
export interface RouteHandler {
  (req: Request, res: Response): void;
}
export interface MiddlewareHandler {
  (req: Request, res: Response, next: NextFunction): void;
}
export interface ErrorRequestHandler {
  (err: any, req: Request, res: Response, next: NextFunction): void;
}

export type BasicRequestHandler = RouteHandler | MiddlewareHandler;
export type ExtendedRequestHandler = string | [ControllerClass, string];

export type Middleware =
  | ExtendedRequestHandler
  | ErrorRequestHandler
  | MiddlewareHandler
  | IRouter;

export type RequestHandler = ExtendedRequestHandler | BasicRequestHandler;

// Implementing the BasicRequestHandler with function overloading
const middleware: BasicRequestHandler = function (
  req: Request,
  res: Response
) {};
