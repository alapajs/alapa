import { BaseApiResponse } from "./base";

/**
 * Represents the structure of an API response.
 *
 * @template T - The type of the data being returned in the response.
 */
export interface ApiSuccessResponse<T = undefined> extends BaseApiResponse {
  status: "success";

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
     * Current page number.
     */
    page: number;

    /**
     * Number of items per page.
     */
    pageSize: number;

    /**
     * Total number of pages available.
     */
    totalPages: number;

    /**
     * Total number of items available.
     */
    totalItems: number;
  };
}
