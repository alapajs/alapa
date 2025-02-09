/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { axios } from "../modules";
import { Logger } from "../utils";

// Define types for HTTP methods and request options
export type HttpClientMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type HttpClientRequestOptions<D = any> = AxiosRequestConfig<D>;

// Define the structure of the response from HttpClient
export interface HttpClientResponse<R = any> {
  code: number;
  status: string;
  data: R;
  error?: any;
}

export class HttpClient {
  // Helper function to handle request with optional retries
  private static handleRequest = async <T = any, R = any>(
    options: HttpClientRequestOptions<T>,
    retries: number = 3 // Default retry count
  ): Promise<HttpClientResponse<R>> => {
    // Setting default values for request options
    options = {
      timeout: 60000, // Default timeout is 60 seconds
      maxRedirects: 5,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    };

    // Check if timeout is valid (between 1s and 60s)
    if (
      options.timeout &&
      (options.timeout < 1000 || options.timeout > 60000)
    ) {
      Logger.warn(
        "HttClient: Timeout is outside of the recommended range (1s to 60s)."
      );
    }

    try {
      const response: AxiosResponse<R> = await axios.request(options);
      return {
        code: response.status,
        status: response.statusText,
        data: response.data,
      };
    } catch (error: any) {
      // Retry logic for network/server issues
      if (
        retries > 0 &&
        (error.code === "ECONNABORTED" || error.response?.status >= 500)
      ) {
        Logger.log(`Retrying request due to error: ${error.message}`);
        return this.handleRequest<T, R>(options, retries - 1);
      }

      // Log the error in development mode for easier debugging
      if (process.env.NODE_ENV === "development") {
        Logger.error("HttpClient Request failed:", error.message);
      }

      const statusCode = error?.response?.status || 0;
      const statusText = error?.response?.statusText || "";
      const data = error?.response?.data || {};

      return {
        code: statusCode,
        status: statusText,
        data,
        error: error?.response?.data || error.message,
      };
    }
  };

  // General method to send a request
  static request = async <T = any, R = any>(
    path: string,
    options: HttpClientRequestOptions<T>,
    retries: number = 3
  ): Promise<HttpClientResponse<R>> => {
    options.url = path; // Ensure the URL is passed properly
    return this.handleRequest<T, R>(options, retries);
  };

  // Convenience method for GET requests
  static get = async <R = any>(
    path: string,
    options?: HttpClientRequestOptions,
    retries: number = 3
  ): Promise<HttpClientResponse<R>> => {
    return this.request<undefined, R>(
      path,
      { method: "GET", ...options },
      retries
    );
  };

  // Convenience method for POST requests
  static post = async <T = any, R = any>(
    path: string,
    data?: T,
    options?: HttpClientRequestOptions<T>,
    retries: number = 3
  ): Promise<HttpClientResponse<R>> => {
    return this.request<T, R>(
      path,
      { method: "POST", data, ...options },
      retries
    );
  };

  // Convenience method for PUT requests
  static put = async <T = any, R = any>(
    path: string,
    data?: T,
    options?: HttpClientRequestOptions<T>,
    retries: number = 3
  ): Promise<HttpClientResponse<R>> => {
    return this.request<T, R>(
      path,
      { method: "PUT", data, ...options },
      retries
    );
  };

  // Convenience method for DELETE requests
  static delete = async <R = any>(
    path: string,
    options?: HttpClientRequestOptions,
    retries: number = 3
  ): Promise<HttpClientResponse<R>> => {
    return this.request<undefined, R>(
      path,
      { method: "DELETE", ...options },
      retries
    );
  };

  // Convenience method for PATCH requests
  static patch = async <T = any, R = any>(
    path: string,
    data?: T,
    options?: HttpClientRequestOptions<T>,
    retries: number = 3
  ): Promise<HttpClientResponse<R>> => {
    return this.request<T, R>(
      path,
      { method: "PATCH", data, ...options },
      retries
    );
  };
}
