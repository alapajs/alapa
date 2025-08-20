import { JWTPayload } from "jose";
import { JWTResponse } from "./abstract";
import { JoseJWT } from "./jose";

/**
 * Static JWT utility class for generating, verifying, and decoding JSON Web Tokens.
 *
 * Uses a fresh JoseJWT instance per operation and supports optional configuration
 * of `sub` (subject) and `nbf` (not before) claims prior to token generation.
 */
export class JWT {
  /** Holds the last error encountered during a JWT operation. */
  static error: unknown;

  /** Optional "not before" claim value to be set during token generation. */
  private static notBefore?: string;

  /** Optional "subject" claim value to be set during token generation. */
  private static subject?: string;

  /**
   * Generates a signed JWT with optional subject and not-before claims.
   *
   * Internally creates a new JoseJWT instance for signing. Optionally sets:
   * - `sub` (subject) if previously defined via `setSubject()`
   * - `nbf` (not before) if previously defined via `setNotBefore()`
   *
   * The expiration time and signing secret can be overridden at runtime.
   *
   * @param payload - The object to embed in the JWT payload.
   * @param overrideKey - Optional secret key to override the default signing key.
   * @param expiresAt - Optional expiration time string.
   *   Examples:
   *   - `"30s"` (30 seconds)
   *   - `"10 minutes"` or `"10m"`
   *   - `"1h"` or `"2 hours"`
   *   - `"3d"` (3 days)
   *   - `"1 week"` or `"2w"`
   *   - `"1y"` (1 year = 365.25 days)
   *   - `"5 minutes ago"` (for past expiry)
   *   - `"2025-12-25T10:00:00Z"` (absolute ISO time)
   *
   * @returns A JWTResponse object containing the signed token and expiration.
   */
  static async generateToken<P = JWTPayload>(
    payload: P & JWTPayload,
    overrideKey?: string,
    expiresAt?: string
  ): Promise<JWTResponse> {
    const jwtService = new JoseJWT();

    if (this.notBefore) {
      jwtService.setNotBefore(this.notBefore);
    }

    if (this.subject) {
      jwtService.setSubject(this.subject);
    }

    const jwt = await jwtService.generateToken(payload, overrideKey, expiresAt);
    return {
      success: true,
      token: jwt.token,
      expiresAt: jwt.expiresAt,
    };
  }

  /**
   * Verifies the integrity and validity of a JWT.
   *
   * Creates a new JoseJWT instance and attempts verification using the configured
   * or overridden secret key. On failure, sets `JWT.error` with the encountered error.
   *
   * @param token - The JWT string to verify.
   * @param overrideKey - Optional secret key to override the default verification key.
   * @returns The decoded JWT payload if valid, or `false` if verification fails.
   */
  static async verifyToken<P = JWTPayload>(
    token: string,
    overrideKey?: string
  ): Promise<(P & JWTPayload) | false> {
    const jwtService = new JoseJWT();
    const result = await jwtService.verifyToken<P & JWTPayload>(
      token,
      overrideKey
    );
    if (result === false) {
      this.error = jwtService.error;
      return false;
    }
    return result;
  }

  /**
   * Decodes a JWT without verifying its signature.
   *
   * Returns the decoded payload regardless of whether the token is expired or tampered.
   * Useful for inspecting token contents, but should not be used for authentication.
   * On failure, sets `JWT.error`.
   *
   * @param token - The JWT string to decode.
   * @returns The decoded JWT payload, or `false` if decoding fails.
   */
  static decodeToken<P = JWTPayload>(token: string): (P & JWTPayload) | false {
    const jwtService = new JoseJWT();
    const result = jwtService.decodeToken<P & JWTPayload>(token);
    if (result === false) {
      this.error = jwtService.error;
      return false;
    }
    return result;
  }

  /**
   * Sets the "nbf" (Not Before) claim to delay token validity.
   *
   * Prevents the token from being valid before the specified time.
   * Takes effect during the next `generateToken()` call only.
   *
   * @param notBefore - A relative time string (e.g., `"30s"`, `"10 minutes"`, `"1h"`, `"2d"`, `"5 minutes ago"`).
   */
  static setNotBefore(notBefore: string): void {
    this.notBefore = notBefore;
  }

  /**
   * Sets the "sub" (Subject) claim for token generation.
   *
   * Identifies the principal the token is issued for (e.g., user ID).
   * Takes effect during the next `generateToken()` call only.
   *
   * @param subject - The subject string to include as the "sub" claim.
   */
  static setSubject(subject: string): void {
    this.subject = subject;
  }
}
