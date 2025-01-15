/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMiddlewareRouteHandler } from "./general";

export interface ControllerOptions {
  middlewareAll?: IMiddlewareRouteHandler[];
  middleware?: { [methodName: string]: IMiddlewareRouteHandler[] };
  namePrefix?: string;
}

export type ControllerClass = any;
