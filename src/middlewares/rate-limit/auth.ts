import { ipKeyGenerator, Options } from "express-rate-limit";

export const authRateLimitOptions: Partial<Options> = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // strict
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    status: 429,
    message: "Too many authentication attempts. Try again in 15 minutes.",
  },

  // Prefer user identifier over IP when possible
  keyGenerator: (req: any) => {
    return req.body?.email || ipKeyGenerator(req.ip);
  },

  skipSuccessfulRequests: true, // don't punish valid logins
};
