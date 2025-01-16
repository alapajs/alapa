/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ErrorRequestHandler,
  RequestHandler as ExpressRequestHandler,
} from "express";
import { ParsedQs } from "qs";
export type RequestHandler =
  | ExpressRequestHandler<
      {}, // Params type (empty object means no params)
      any, // Response body type (any means it can be any type)
      any, // Request body type (any means it can be any type)
      ParsedQs, // Query string type (ParsedQs is used for query strings)
      Record<string, any> // Extra options (custom type for additional options)
    >
  | string
  | [any, string];

export type Middleware = RequestHandler | ErrorRequestHandler;
