export interface CacheConfiguration {
  driver?: "memory" | "redis" | "memcached"; // Caching driver
  ttl?: number; // Time-to-live for cache items
  redisConfig?: {
    // Redis-specific caching configuration
    host: string;
    port: number;
    password?: string;
  };
  memcachedConfig?: {
    // Memcached-specific caching configuration
    servers: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any;
  };
  clearOnStartup?: boolean; // Clear cache on server startup
}
