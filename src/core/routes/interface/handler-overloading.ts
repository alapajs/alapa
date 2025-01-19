import { RequestHandler } from "./handler";
import { RouteChain } from "./route-chain";

export interface MethodHandlers {
  // Method signature for handling a single handler
  get(path: string, handler: RequestHandler): RouteChain;

  // Method signature for handling multiple handlers
  get(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;

  // Similar overloads for other HTTP methods can be added similarly.
  post(path: string, handler: RequestHandler): RouteChain;
  post(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;

  // Method signature for handling a single handler
  all(path: string, handler: RequestHandler): RouteChain;

  // Method signature for handling multiple handlers
  all(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;

  put(path: string, handler: RequestHandler): RouteChain;
  put(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;

  delete(path: string, handler: RequestHandler): RouteChain;
  delete(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;

  patch(path: string, handler: RequestHandler): RouteChain;
  patch(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;

  options(path: string, handler: RequestHandler): RouteChain;
  options(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;

  head(path: string, handler: RequestHandler): RouteChain;
  head(
    path: string,
    handler: RequestHandler,
    ...handlers: RequestHandler[]
  ): RouteChain;
  view(path: string, view: string): RouteChain;
  view(path: string, view: string, data: object): RouteChain;

  use(middleware: RequestHandler): RouteChain;
  use(path: string, ...handlers: RequestHandler[]): RouteChain;
}
