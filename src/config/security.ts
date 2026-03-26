import { Options } from "normalize-url";

export interface SecurityConfiguration {
  /** Name of CSRF token in requests */
  csrfTokenName?: string;
  /** Enable or disable XSS protection */
  xssProtection?: boolean;
  /** X-Frame-Options header value */
  frameOptions?: "DENY" | "SAMEORIGIN";
  /** Content Security Policy (CSP) header value */
  contentSecurityPolicy?: string;
  /** Enable or disable HTTP Strict Transport Security (HSTS) */
  hsts?: boolean;
  /** Additional rate limiting for security */
  rateLimit?: {
    /** Time window in milliseconds */
    windowMs: number;
    /** Maximum number of requests in the window */
    max: number;
    /** IPs to whitelist from rate limiting */
    whitelist?: string[];
  };
  /** URL normalization configuration */
  url?: {
    /** Enable or disable URL normalization */
    normalize?: boolean;
    /** URL normalization options */
    normalizeOptions?: Options;
  };
}
