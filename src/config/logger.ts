// Logger settings
export interface LoggerConfiguration {
  /** Logging level */
  level: "info" | "error" | "warn" | "debug";
  /** Log output destination */
  output?: "console" | "file";
  /** File path for logs if output is set to file */
  filePath?: string;
  /** Log format (e.g., JSON, plain text) */
  format?: "json" | "text";
  /** Maximum log file size before rotation (e.g., "10MB") */
  maxFileSize?: string;
  /** Maximum number of rotated files to keep */
  maxFiles?: number;
  /** Type of request logging */
  requestLogType?: "basic" | "detailed" | "none" | "full" | "extended" | string;
}
