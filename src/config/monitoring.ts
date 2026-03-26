export interface MonitoringConfiguration {
  /** Enable or disable monitoring */
  enabled?: boolean;
  /** Endpoint for health checks */
  endpoint?: string;
  /** Enable metrics collection (e.g., Prometheus) */
  metrics?: boolean;
  /** Interval for uptime checks (in ms) */
  uptimeCheckInterval?: number;
}
