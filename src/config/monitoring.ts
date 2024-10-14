export interface MonitoringConfiguration {
  enabled?: boolean; // Enable or disable monitoring
  endpoint?: string; // Endpoint for health checks
  metrics?: boolean; // Enable metrics collection (e.g., Prometheus)
  uptimeCheckInterval?: number; // Interval for uptime checks (in ms)
}
