import {
  Options,
  RateLimitRequestHandler,
  Store,
  ipKeyGenerator as ipKeyGeneratorFn,
} from "express-rate-limit";
import { createRateLimit } from "./create";
import { authRateLimitOptions } from "./auth";
import { apiRateLimitOptions } from "./api";
import { publicRateLimitOptions } from "./public";
import { Request } from "express";

export class RateLimit {
  static create(passedOptions?: Partial<Options>): RateLimitRequestHandler {
    return createRateLimit(passedOptions);
  }

  static auth(overrides?: Partial<Options>): RateLimitRequestHandler {
    return createRateLimit({
      ...authRateLimitOptions,
      ...overrides,
    });
  }

  static api(overrides?: Partial<Options>): RateLimitRequestHandler {
    return createRateLimit({
      ...apiRateLimitOptions,
      ...overrides,
    });
  }

  static public(overrides?: Partial<Options>): RateLimitRequestHandler {
    return createRateLimit({
      ...publicRateLimitOptions,
      ...overrides,
    });
  }

  static ipKeyGenerator(ip: string, ipv6Subnet?: number | false | undefined) {
    return ipKeyGeneratorFn(ip, ipv6Subnet);
  }
}

export const rateLimit = RateLimit.create;
export interface RateLimitStore extends Store {}
