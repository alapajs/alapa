export interface MiddlewareConfiguration {
  global?: string[]; // Global middleware to apply on every request
  routeSpecific?: {
    // Middleware specific to routes
    [route: string]: string[];
  };
  csrfProtection?: boolean; // Enable or disable CSRF protection
}
