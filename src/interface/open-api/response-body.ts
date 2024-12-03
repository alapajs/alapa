/**
 * Represents a response in OpenAPI specification.
 */
export interface OpenApiResponse {
  /**
   * A short description of the response.
   */
  description?: string;

  /**
   * The content of the response, mapped by media type.
   * Each media type (e.g., "application/json") contains a schema that defines the structure of the response.
   */
  content?: {
    [mediaType: string]: {
      /**
       * A schema that describes the structure of the response body.
       * Can be an inline schema or a reference (e.g., "$ref": "#/components/schemas/SomeSchema").
       */
      schema?: OpenApiSchemas | string;
    };
  };
}

/**
 * Represents the available HTTP methods for a path in OpenAPI.
 */
export interface PathProperties {
  /**
   * The HTTP method (e.g., GET, POST, PUT) mapped to an OpenApiMethod.
   */
  [method: string]: OpenApiMethod;
}

/**
 * Represents the properties of an individual HTTP operation in OpenAPI (such as GET, POST, etc.).
 */
export interface OpenApiMethod {
  /**
   * A short summary of what the operation does.
   */
  summary?: string;

  /**
   * A detailed description of the operation.
   */
  description?: string;

  /**
   * Tags used to categorize and organize the operation.
   * Tags can either be a string or an array of strings.
   */
  tags?: string[] | string;

  /**
   * A list of parameters for the operation.
   * Parameters may include query, header, path, or cookie parameters.
   */
  parameters?: OpenApiParameters[];

  /**
   * Describes the request body, which defines the content of the request.
   */
  requestBody?: OpenApiRequestBody;

  /**
   * Security requirements for the operation (e.g., OAuth2, API Key).
   * Maps to the security definitions in OpenAPI.
   */
  security?: { [key: string]: string[] };

  /**
   * The responses mapped by HTTP status code.
   * Each response may include content, a schema, and a description.
   */
  responses: { [statusCode: string]: OpenApiResponse | string };
}

/**
 * Represents a schema in OpenAPI, used to describe complex data types like objects or arrays.
 */
export interface OpenApiSchemas {
  /**
   * The type of the schema (e.g., "object", "array", "string").
   */
  type: string;

  /**
   * A reference to a reusable schema, indicated by a $ref.
   * This points to another schema defined elsewhere in the OpenAPI specification.
   */
  ref?: string;

  /**
   * A list of required properties, or a boolean indicating whether all properties are required.
   */
  required?: string[] | boolean;

  /**
   * Properties of the schema, used if the type is "object".
   * Each property can have its own schema.
   */
  properties?: { [key: string]: OpenApiProperties } | string;

  /**
   * Defines the items within an array, used if the type is "array".
   */
  items?: OpenApiSchemas;
}

/**
 * Represents the properties of an object in OpenAPI schemas.
 */
export interface OpenApiProperties {
  /**
   * The type of the property (e.g., "string", "integer", "boolean").
   */
  type: string;

  /**
   * An optional format for the property, such as "date-time" or "email".
   */
  format?: string;

  /**
   * A set of allowable values for the property.
   */
  enum?: unknown[];

  /**
   * An example value for the property, used to illustrate the expected data format.
   */
  example?: unknown;

  /**
   * A regular expression pattern for string properties.
   */
  pattern?: string;

  /**
   * If the property is an object, this specifies its properties.
   */
  properties?: { [key: string]: OpenApiSchemas };
}

/**
 * Represents a parameter for an HTTP operation in OpenAPI.
 */
export interface OpenApiParameters {
  /**
   * The name of the parameter.
   */
  name: string;

  /**
   * The location of the parameter.
   * Can be "query", "header", "path", or "cookie".
   */
  in: "query" | "header" | "path" | "cookie";

  /**
   * Whether the parameter is required.
   */
  required?: boolean;

  /**
   * A description of the parameter's purpose and usage.
   */
  description?: string;

  /**
   * A schema that defines the structure of the parameter, used for complex parameters.
   * Can be a reference to another schema or an inline schema.
   */
  schema?: OpenApiSchemas | string;
}

/**
 * Represents the body of an HTTP request in OpenAPI.
 */
export interface OpenApiRequestBody {
  /**
   * Whether the request body is required.
   */
  required?: boolean;

  /**
   * The content of the request body, mapped by media type.
   * Each media type (e.g., "application/json") contains a schema that defines the structure of the body.
   */
  content?: {
    [mediaType: string]: {
      /**
       * A schema that defines the structure of the request body.
       * Can be an inline schema or a reference (e.g., "$ref": "#/components/schemas/RequestBodySchema").
       */
      schema?: OpenApiSchemas | string;
    };
  };
}
