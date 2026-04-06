/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiResponse } from "./base";

export interface OtherApiResponse<T = undefined> extends BaseApiResponse {
  /**
   * The main payload of the response, which can be an object of type T or null.
   */
  data?: T | null;
}
