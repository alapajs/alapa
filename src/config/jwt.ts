export interface JWTConfiguration {
  secret?: string; // Secret key for JWT signing
  expiresAt?: number; // Expiration time for JWT
  algorithm?: "HS256" | "HS384" | "HS512"; // Signing algorithm
  refreshSecret?: string; // Secret key for refresh tokens
  refreshExpiresIn?: string; // Expiration time for refresh tokens
  issuer?: string; // JWT issuer claim
  audience?: string; // JWT audience claim
}
