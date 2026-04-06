import {
  HTTP_STATUS_CODE,
  HTTP_STATUS,
  HttpStatusValue,
} from "../../interface/http";
import { ApiErrorResponse } from "./error";
import { OtherApiResponse } from "./other";
import { ApiSuccessResponse } from "./success";
type HttpStatusKey = keyof typeof HTTP_STATUS;
type HttpResponseStatus = HTTP_STATUS | HttpStatusKey | HttpStatusValue;
export interface BaseApiResponse<T = any> {
  code?: number;
  /**
   * Indicates the status of the response.
   */
  status: HttpResponseStatus;
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
export type ApiResponse<T = undefined> =
  | ApiErrorResponse
  | ApiSuccessResponse<T>
  | OtherApiResponse<T>;

export function getStatusCode(status: string) {
  return (HTTP_STATUS_CODE as any)[status.toUpperCase()];
}
