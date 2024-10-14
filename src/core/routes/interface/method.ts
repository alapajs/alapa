import { RequestHandler } from "./general";
import { RouteChain } from "./route-chain";
export type MethodList =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export interface IRouteMethod {
  all: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  get: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  post: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  put: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  delete: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  patch: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  options: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  head: (path: string, ...handlers: RequestHandler[]) => RouteChain;
  view: (path: string, view: string, data?: object) => RouteChain;
}
