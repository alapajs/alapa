export interface EmailConfiguration {
  /** SMTP host */
  host?: string;
  /** SMTP port */
  port?: number;
  /** SMTP username */
  username?: string;
  /** SMTP password */
  password?: string;
  /** Default 'from' address */
  from?: string;
  /** Encryption method */
  encryption?: "tls" | "ssl";
  /** Number of retry attempts on sending failure */
  retryAttempts?: number;
  /** Delay between retry attempts (in ms) */
  templateEngine?: "pug" | "ejs" | "handlebars"; // Template engine for emails
}
