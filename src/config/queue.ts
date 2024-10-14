export interface QueueConfiguration {
  driver?: "sync" | "redis"; // Queue driver (e.g., synchronous, Redis)
  redisConfig?: {
    // Redis configuration for queues
    host: string;
    port: number;
    password?: string;
  };
  defaultTimeout?: number; // Default timeout for queue jobs
  failedJobsTable?: string; // Table for storing failed jobs
  retryAfter?: number; // Retry failed jobs after specified seconds
}
