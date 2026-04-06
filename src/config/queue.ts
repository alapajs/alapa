export interface QueueConfiguration {
  /** Queue driver (e.g., synchronous, Redis) */
  driver?: "sync" | "redis";
  /** Redis configuration */
  redisConfig?: {
    /** Redis host */
    host: string;
    /** Redis port */
    port: number;
    /** Redis password */
    password?: string;
    /** Redis URL */
    url?: string;
    /** Redis database */
    db?: number;
  };
  /** Default timeout for queue jobs */
  defaultTimeout?: number;
  /** Table for storing failed jobs */
  failedJobsTable?: string;
  /** Retry failed jobs after specified seconds */
  retryAfter?: number;
}
