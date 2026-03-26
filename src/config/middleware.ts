export interface MiddlewareConfiguration {
  /** Global middleware to apply on every request */
  global?: string[];
  /** Middleware specific to routes */
  routeSpecific?: {
    [route: string]: string[];
  };
  /** Enable or disable CSRF protection */
  csrfProtection?: boolean;
}
