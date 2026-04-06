/**
 * Configuration options for JSON Web Token (JWT) signing and validation.
 *
 * These settings are used by the JWT service for generating and verifying access
 * and refresh tokens. All properties are optional and can be provided via code,
 * environment variables, or global configuration.
 */
export interface JWTConfiguration {
  /**
   * Secret key used to sign and verify JWT access tokens.
   *
   * If not provided, the system will attempt to fall back to other values such as:
   * - `process.env.JWT_SECRET`
   * - `process.env.ENCRYPTION_KEY`
   * - `process.env.SECRET_KEY`
   * - A system fingerprint (as a last resort, in development only)
   */
  secret?: string;

  /**
   * Default expiration time for access tokens.
   *
   * Supports relative time strings (e.g., "1h", "30 minutes", "7d") or
   * absolute ISO date strings (e.g., "2025-12-31T23:59:59Z").
   *
   * Example values:
   * - `"15m"` (15 minutes)
   * - `"2h"` (2 hours)
   * - `"1d"` (1 day)
   * - `"1y"` (1 year)
   */
  expiresAt?: string;

  /**
   * JWT signing algorithm to use.
   *
   * Defaults to `"HS256"` if not specified.
   *
   * Supported values:
   * - `"HS256"` (HMAC using SHA-256)
   * - `"HS384"` (HMAC using SHA-384)
   * - `"HS512"` (HMAC using SHA-512)
   */
  algorithm?: "HS256" | "HS384" | "HS512";

  /**
   * Secret key used specifically for signing refresh tokens.
   *
   * If not provided, falls back to the main `secret` value.
   */
  refreshSecret?: string;

  /**
   * Expiration time for refresh tokens.
   *
   * Accepts the same format as `expiresAt`. Should be longer than access token expiry.
   *
   * Example: `"30d"` for 30 days.
   */
  refreshExpiresIn?: string;

  /**
   * Issuer claim (`iss`) to include in generated tokens and check during verification.
   *
   * Helps verify that the token was created by your application.
   */
  issuer?: string;

  /**
   * Audience claim (`aud`) to include in generated tokens and check during verification.
   *
   * Indicates the intended recipient of the token.
   */
  audience?: string;
}
