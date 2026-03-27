import { Options } from "express-rate-limit";

export const publicRateLimitOptions: Partial<Options> = {
  windowMs: 15 * 60 * 1000,
  limit: 1000, // relaxed

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    status: 429,
    message: "Rate limit exceeded. Try again later.",
  },
};
