export interface SessionConfiguration {
  secret: string; // Secret key for session signing
  expiresIn: string; // Session expiration time
  storage?: "memory" | "redis" | "database"; // Session storage type
  redisConfig?: {
    // Redis configuration for session storage
    host: string;
    port: number;
    password?: string;
  };
  databaseConfig?: {
    // Database configuration for session storage
    tableName: string;
    connection: string;
  };
  secure?: boolean; // Enable secure cookies (for HTTPS)
  sameSite?: "lax" | "strict" | "none"; // SameSite attribute for cookies
}
