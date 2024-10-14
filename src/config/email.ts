export interface EmailConfiguration {
  host?: string; // SMTP host
  port?: number; // SMTP port
  username?: string; // SMTP username
  password?: string; // SMTP password
  from?: string; // Default 'from' address
  encryption?: "tls" | "ssl"; // Encryption method
  retryAttempts?: number; // Number of retry attempts on sending failure
  retryDelay?: number; // Delay between retry attempts (in ms)
  templateEngine?: "pug" | "ejs" | "handlebars"; // Template engine for emails
}
