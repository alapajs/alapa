import { Router } from "../core/routes";

// Server configuration
export interface ServerConfiguration {
  port?: number;
  host?: string;
  routes: Array<Router> | Router;
  apiRoutes: Array<Router> | Router;
  proxy?: boolean;
  compression?: boolean;
  https?: {
    enabled: boolean;
    keyPath: string;
    certPath: string;
    caPath: string;
  };
}
