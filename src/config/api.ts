import { OAS3Definition, OAS3Options } from "swagger-jsdoc";

export interface APIConfiguration {
  docs?: {
    path?: string;
    schemasDir?: string;
    docPrefix?: string;
    sync?: boolean;
    openApiOptions?: OAS3Options;
    openApiDefinitions?: OAS3Definition;
    openapiDefinitionFile?: string;
    basicAuthEnabled?: boolean;
    basicAuthUser?: string;
    basicAuthPassword?: string;
  };

  rateLimit?: {
    // API rate limiting configuration
    /** Time window in milliseconds */
    windowMs: number;
    /** Maximum number of requests in the window */
    max: number;
    /** Include rate limit headers in responses */
    headers?: boolean;
  };
  cors?: {
    // CORS configuration
    /** Allowed origins */
    origin: string | string[];
    /** Allowed methods */
    methods: string | string[];
    /** Allow credentials */
    credentials?: boolean;
  };
  versioning?: {
    /** Enable API versioning */
    enabled: boolean;
    /** Default API version */
    defaultVersion?: string;
    /** Where to check for the version (header or query string) */
    parameter?: "header" | "query";
  };
}
