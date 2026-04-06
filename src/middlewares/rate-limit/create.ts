import rateLimit, {
  Options,
  RateLimitRequestHandler,
} from "express-rate-limit";

export const createRateLimit = (
  passedOptions?: Partial<Options> | undefined,
): RateLimitRequestHandler => {
  return rateLimit(passedOptions);
};
