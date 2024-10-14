import { ApiErrorResponse } from "./error";
import { ApiSuccessResponse } from "./success";

export type ApiResponseStatus =
  | "success"
  | "error"
  | "not_found"
  | "forbidden"
  | "unauthorized"
  | "invalid_request"
  | "conflict"
  | "processing"
  | "accepted"
  | "timeout"
  | "service_unavailable"
  | "bad_gateway"
  | "unprocessable_entity"
  | "method_not_allowed"
  | "not_implemented"
  | "too_many_requests"
  | "moved_permanently"
  | "moved_temporarily"
  | "suspended"
  | "not_authorized"
  | "account_locked"
  | "session_expired"
  | "resource_created"
  | "resource_updated"
  | "resource_deleted"
  | "data_conflict"
  | "data_validation_failed"
  | "payment_required"
  | "feature_not_available"
  | "dependency_error";

export interface BaseApiResponse {
  /**
   * Indicates the status of the response.
   */
  status: ApiResponseStatus;
  /**
   * A user-friendly message providing additional information about the response.
   */
  message?: string;
}

/**
 * Represents the structure of an API response.
 *
 * @template T - The type of the data being returned in the response.
 */
export type ApiResponse<T> = ApiErrorResponse | ApiSuccessResponse<T>;
