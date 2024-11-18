export interface OpenApiResponse {
  content?:
    | {
        [key: string]: {
          schema?: OpenApiSchemas | string;
        };
      }
    | string;
  description?: string;
}

export interface PathProperties {
  [key: string]: OpenApiMethod;
}

export interface OpenApiMethod {
  summary?: string;
  description?: string;
  tags?: string[] | string;
  parameters?: OpenApiParameters[] | string;
  requestBody?: OpenApiRequestBody | string;
  security?: { [key: string]: string[] };
  responses: { [key: string]: OpenApiResponse | string };
}

export interface OpenApiSchemas {
  type: string;
  ref?: string;
  required?: string[] | boolean;
  properties?:
    | {
        [key: string]: OpenApiProperties;
      }
    | string;
  items?:
    | {
        type: string;
        properties:
          | {
              [key: string]: OpenApiProperties;
            }
          | string;
        required?: string[];
      }
    | string;
}

export interface OpenApiProperties {
  type: string;
  format?: string;
  enum?: unknown[];
  example?: unknown;
  pattern?: string;
}

export interface OpenApiParameters {
  name: string;
  in: "query" | "header" | "path" | "cookie" | "body";
  required?: boolean;
  description?: string;
  schema?: OpenApiSchemas;
}

export interface OpenApiRequestBody {
  required?: boolean;
  content?: {
    [key: string]: {
      schema?: OpenApiSchemas | "string";
    };
  };
}
