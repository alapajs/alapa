import { OAS3Definition, OAS3Options } from "swagger-jsdoc";

export interface APIConfiguration {
  docs?: {
    path?: string;
    schemasDir?: string;
    sync?: boolean;
    openApiOptions?: OAS3Options;
    openApiDefinitions?: OAS3Definition;
    openapiDefinitionFile?: string;
  };

  rateLimit?: {
    // API rate limiting configuration
    windowMs: number; // Time window in milliseconds
    max: number; // Maximum number of requests in the window
    headers?: boolean; // Include rate limit headers in responses
  };
  cors?: {
    // CORS configuration
    origin: string | string[]; // Allowed origins
    methods: string | string[]; // Allowed methods
    credentials?: boolean; // Allow credentials
  };
  versioning?: {
    // API versioning settings
    enabled: boolean; // Enable API versioning
    defaultVersion?: string; // Default API version
    parameter?: "header" | "query"; // Where to check for the version (header or query string)
  };
}
