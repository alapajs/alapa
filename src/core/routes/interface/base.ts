/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRouter, Router } from "express";
import { RequestHandler } from "./general";
import { RouteChain } from "./route-chain";
import { ResourceOptions } from "../handlers/extension";

export interface BaseRouterInterface {
  resource: (
    path: string,
    controller: any,
    option?: ResourceOptions
  ) => RouteChain;
  restfulResource: (
    path: string,
    controller: any,
    option?: ResourceOptions
  ) => RouteChain;

  apiResource: (
    path: string,
    controller: any,
    option?: ResourceOptions
  ) => RouteChain;
  resources: (
    resources: { [route: string]: any },
    option: ResourceOptions
  ) => RouteChain;

  restfulResources: (
    resources: { [route: string]: any },
    option: ResourceOptions
  ) => RouteChain;

  apiResources: (
    resources: { [route: string]: any },
    option: ResourceOptions
  ) => RouteChain;

  all: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  get: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  post: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  put: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  delete: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  patch: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  options: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  head: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  view: (path: string, view: string, data?: object) => RouteChain;
  use: (
    pathOrHandler: string | RequestHandler | Router | IRouter,
    ...handlers: RequestHandler[] | Router[] | IRouter[]
  ) => RouteChain;
}
