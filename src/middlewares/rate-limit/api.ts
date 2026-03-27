import { ipKeyGenerator, Options } from "express-rate-limit";

export const apiRateLimitOptions: Partial<Options> = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // moderate
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    status: 429,
    message: "Too many requests. Please slow down.",
  },

  keyGenerator: (req: any) => {
    return req.user?.id || ipKeyGenerator(req);
  },
};
