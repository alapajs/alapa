export interface CacheConfiguration {
  /** Caching driver */
  driver?: "memory" | "redis" | "memcached";
  /** Time-to-live for cache items */
  ttl?: number;
  /** Redis-specific caching configuration */
  redisConfig?: {
    /** Redis host */
    host: string;
    /** Redis port */
    port: number;
    /** Redis password */
    password?: string;
  };
  /** Memcached-specific caching configuration */
  memcachedConfig?: {
    /** Memcached servers */
    servers: string[];
    /** Memcached options */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any;
  };
  /** Clear cache on server startup */
  clearOnStartup?: boolean;
}
