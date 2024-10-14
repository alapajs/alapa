export interface SecurityConfiguration {
  csrfTokenName?: string; // Name of CSRF token in requests
  xssProtection?: boolean; // Enable or disable XSS protection
  frameOptions?: "DENY" | "SAMEORIGIN"; // X-Frame-Options header value
  contentSecurityPolicy?: string; // Content Security Policy (CSP) header value
  hsts?: boolean; // Enable or disable HTTP Strict Transport Security (HSTS)
  rateLimit?: {
    // Additional rate limiting for security
    windowMs: number; // Time window in milliseconds
    max: number; // Maximum number of requests in the window
    whitelist?: string[]; // IPs to whitelist from rate limiting
  };
}
