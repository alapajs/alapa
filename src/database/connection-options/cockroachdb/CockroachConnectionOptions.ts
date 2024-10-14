/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
import { ReplicationMode } from "typeorm/driver/types/ReplicationMode";
import { CockroachConnectionCredentialsOptions } from "./CockroachConnectionCredentialsOptions";
/**
 * Cockroachdb-specific connection options.
 */
export interface CockroachConnectionOptions
  extends BaseDataSourceOptions,
    CockroachConnectionCredentialsOptions {
  /**
   * Database type.
   */
  type: "cockroachdb";
  /**
   * Enable time travel queries on cockroachdb.
   * https://www.cockroachlabs.com/docs/stable/as-of-system-time.html
   */
  timeTravelQueries: boolean;
  /**
   * Schema name.
   */
  schema?: string;
  /**
   * The driver object
   * This defaults to `require("pg")`.
   */
  driver?: any;
  /**
   * The driver object
   * This defaults to `require("pg-native")`.
   */
  nativeDriver?: any;
  /**
   * Replication setup.
   */
  replication?: {
    /**
     * Master server used by orm to perform writes.
     */
    master: CockroachConnectionCredentialsOptions;
    /**
     * List of read-from severs (slaves).
     */
    slaves: CockroachConnectionCredentialsOptions[];
    /**
     * Default connection pool to use for SELECT queries
     * @default "slave"
     */
    defaultMode?: ReplicationMode;
  };
  /**
   * sets the application_name var to help db administrators identify
   * the service using this connection. Defaults to 'undefined'
   */
  applicationName?: string;
  /**
   * Function handling errors thrown by drivers pool.
   * Defaults to logging error with `warn` level.
   */
  poolErrorHandler?: (err: any) => any;
  /**
   * Max number of transaction retries in case of 40001 error.
   */
  maxTransactionRetries?: number;
}
