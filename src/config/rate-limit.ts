import { RateLimitRequestHandler } from "express-rate-limit";
import { RateLimitStore } from "../middlewares";

export interface RateLimitConfiguration {
  /** Enable or disable rate limit */
  enable?: boolean;

  /** Global rate limit rules */
  global?: RateLimitRequestHandler[];

  /** Route-specific rules */
  routeSpecific?: {
    [route: string]: RateLimitRequestHandler[];
  };

  /** Shared store */
  store?: RateLimitStore;
}
