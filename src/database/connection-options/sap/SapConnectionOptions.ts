/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
import { SapConnectionCredentialsOptions } from "./SapConnectionCredentialsOptions";
/**
 * SAP Hana specific connection options.
 */
export interface SapConnectionOptions
  extends BaseDataSourceOptions,
    SapConnectionCredentialsOptions {
  /**
   * Database type.
   */
  type: "sap";
  /**
   * Database schema.
   */
  schema?: string;
  /**
   * The driver objects
   * This defaults to require("hdb-pool")
   */
  driver?: any;
  /**
   * The driver objects
   * This defaults to require("@sap/hana-client")
   */
  hanaClientDriver?: any;
  /**
   * Pool options.
   */
  pool?: {
    /**
     * Max number of connections.
     */
    max?: number;
    /**
     * Minimum number of connections.
     */
    min?: number;
    /**
     * Maximum number of waiting requests allowed. (default=0, no limit).
     */
    maxWaitingRequests?: number;
    /**
     * Max milliseconds a request will wait for a resource before timing out. (default=5000)
     */
    requestTimeout?: number;
    /**
     * How often to run resource timeout checks. (default=0, disabled)
     */
    checkInterval?: number;
    /**
     * Idle timeout
     */
    idleTimeout?: number;
    /**
     * Function handling errors thrown by drivers pool.
     * Defaults to logging error with `warn` level.
     */
    poolErrorHandler?: (err: any) => any;
  };
  poolSize?: never;
}
