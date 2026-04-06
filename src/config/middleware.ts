import { RequestHandler } from "express";

export interface MiddlewareConfiguration {
  /** Global middleware to apply on every request */
  global?: RequestHandler[];
  /** Middleware specific to routes */
  routeSpecific?: {
    [route: string]: RequestHandler[];
  };
  /** Enable or disable CSRF protection */
  csrfProtection?: boolean;
}
