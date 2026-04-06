import { HTTP_STATUS } from "../../interface";
import { BaseApiResponse } from "./base";

/**
 * Represents the structure of an API response.
 *
 * @template T - The type of the data being returned in the response.
 */
export interface ApiSuccessResponse<T = undefined> extends BaseApiResponse {
  status: HTTP_STATUS.SUCCESS | "success" | "SUCCESS";

  /**
   * The main payload of the response, which can be an object of type T or null.
   */
  data: T | null;

  /**
   * Optional timestamp indicating when the response was generated.
   * If not provided, the server can still log the response time separately.
   */
  timestamp?: string;

  /**
   * Optional pagination object for responses that involve multiple items.
   */
  pagination?: {
    /**
     * Total number of items available.
     */

    total?: number;

    /**
     * Current page number.
     */
    page?: number;

    /**
     * Number of items per page.
     */
    pageSize?: number;

    /**
     * Total number of pages available.
     */
    totalPages?: number;

    /**
     * Total number of items available.
     */
    totalItems?: number;

    /**
     * Maximum number of items allowed per page.
     */
    limit?: number;

    /**
     * Number of items to skip before starting to collect the result set.
     */
    offset?: number;
  };
}
