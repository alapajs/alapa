import { Router } from "../core/routes";

/**
 * Defines the configuration structure for the HTTP server.
 */
export interface ServerConfiguration {
  /**
   * The port the server should listen on.
   *
   * @example 3000
   */
  port?: number;

  /**
   * The hostname or IP address the server should bind to.
   * Defaults to '0.0.0.0' if not specified.
   *
   * @example "localhost"
   * @example "127.0.0.1"
   */
  host?: string;

  /**
   * The set of application (non-API) routes to register.
   * Can be a single Router instance or an array of Routers.
   */
  routes: Array<Router> | Router;

  /**
   * The set of API routes to register.
   * Can be a single Router instance or an array of Routers.
   */
  apiRoutes: Array<Router> | Router;

  /**
   * Defines which upstream proxies are trusted when parsing headers
   * like `X-Forwarded-For`, `X-Forwarded-Proto`, etc.
   *
   * This is relevant if your app is behind a reverse proxy or load balancer.
   *
   * - `true`: Trust **all** proxies — Express will use all forwarded headers without validation.
   *   ⚠️ Use with caution — only recommended if you're behind a secure proxy (e.g., NGINX, AWS ALB).
   *
   * - `false` (or `undefined`): No proxies are trusted — Express will ignore forwarded headers.
   *
   * - `string[]`: Trust only the specified IP addresses or subnets.
   *   You can provide IPs or CIDR ranges.
   *
   * @example true
   * @example false
   * @example ["127.0.0.1", "10.0.0.0/8"]
   *
   * @see https://expressjs.com/en/guide/behind-proxies.html
   */
  trustedProxies?: boolean | string[];

  /**
   * Enables Gzip compression for responses if true.
   * Compression can reduce payload size and improve client performance.
   *
   * @default false
   */
  compression?: boolean;

  /**
   * HTTPS configuration. If provided and `enabled` is `true`, the server will use HTTPS.
   * You must specify valid file paths for the key, certificate, and optionally a CA bundle.
   *
   * @example
   * {
   *   enabled: true,
   *   keyPath: "./ssl/private.key",
   *   certPath: "./ssl/certificate.crt",
   *   caPath: "./ssl/ca_bundle.crt"
   * }
   */
  https?: {
    /**
     * Enables HTTPS server mode.
     */
    enabled: boolean;

    /**
     * File path to the TLS private key.
     */
    keyPath: string;

    /**
     * File path to the TLS certificate.
     */
    certPath: string;

    /**
     * Optional file path to the CA certificate bundle.
     */
    caPath: string;
  };
}
