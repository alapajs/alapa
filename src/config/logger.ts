// Logger settings
export interface LoggerConfiguration {
  level: "info" | "error" | "warn" | "debug"; // Logging level
  output?: "console" | "file"; // Log output destination
  filePath?: string; // File path for logs if output is set to file
  format?: "json" | "text"; // Log format (e.g., JSON, plain text)
  maxFileSize?: string; // Maximum log file size before rotation (e.g., "10MB")
  maxFiles?: number; // Maximum number of rotated files to keep
}
