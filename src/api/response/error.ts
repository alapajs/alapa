/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiResponse } from "./base";

export interface ApiErrorResponse extends BaseApiResponse {
  /**
   * Optional custom code for additional context about the response.
   * This can be used to provide more granular information than HTTP status codes.
   */
  code?: number;

  /**
   * Detailed description of the error.
   * This should provide enough context for the user to understand what went wrong.
   */
  details?: string;

  /**
   * Optional reference application-specific error code.
   * This can help in identifying specific errors in the application.
   */
  referenceCode?: string;

  /**
   * A human-readable message summarizing the error.
   * This message can be shown directly to users to convey what happened.
   */
  message?: string;

  /**
   * The HTTP status code associated with the error.
   * This can help the client understand the nature of the failure (e.g., 404, 500).
   */
  statusCode?: number;

  /**
   * A timestamp indicating when the error occurred.
   * Useful for debugging and logging purposes.
   */
  timestamp?: string;

  /**
   * An array of validation errors if the error is related to input validation.
   * This can help users understand what went wrong with their input.
   */
  validationErrors?: Array<{
    field: string; // The field that caused the validation error
    message: string; // The validation error message
    code?: string; // Optional error code related to the validation failure
  }>;

  /**
   * Optional links or suggestions for resolving the error.
   * This can guide users on how to fix the issue or provide further documentation.
   */
  links?: Array<{
    href: string; // The URL to the documentation or help page
    rel: string; // A relation type (e.g., "help", "documentation")
  }>;

  /**
   * Optional context about the request that caused the error.
   * This may include information about the request parameters, headers, or body.
   */
  requestContext?: {
    method: string; // The HTTP method used (GET, POST, etc.)
    url: string; // The URL of the request
    headers?: Record<string, string>; // The request headers
    body?: Record<string, any>; // The request body (if applicable)
    query?: Record<string, any>; // Query parameters in the request
    params?: Record<string, any>; // Route parameters in the request
  };

  /**
   * Optional server-side stack trace or error log.
   * This is useful for developers and support teams to diagnose issues.
   */
  stackTrace?: string;

  /**
   * Optional suggestions or possible causes for the error.
   * This could guide users on what might have gone wrong.
   */
  suggestions?: Array<string>;

  /**
   * User-friendly error category.
   * This can help in classifying errors for easier handling (e.g., "client error", "server error").
   */
  category?:
    | "client"
    | "server"
    | "network"
    | "validation"
    | "authentication"
    | "authorization"
    | "timeout"
    | "resource"
    | "business logic"
    | "third-party service"
    | "data format"
    | "service unavailable";

  /**
   * Additional context for developers or support teams.
   * This could include information about the environment (e.g., production, staging) or user session details.
   */
  developerContext?: {
    environment?: string; // e.g., "production", "staging"
    userId?: string; // User ID associated with the request, if applicable
    sessionId?: string; // Session ID associated with the request, if applicable
    traceId?: string; // Unique identifier for tracing requests across services
    correlationId?: string; // Identifier for grouping related requests in a distributed system
  };

  /**
   * Optional fields for logging purposes.
   * This can help in centralizing logging and monitoring.
   */
  logging?: {
    errorId?: string; // Unique ID for the logged error
    timestamp?: string; // Timestamp of the log entry
    severity?: "info" | "warn" | "error" | "debug"; // Severity level of the log entry
    additionalData?: Record<string, any>; // Any additional data to be logged with the error
  };
}
