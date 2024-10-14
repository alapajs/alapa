/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * Sqlite-specific connection options.
 */
export interface CordovaConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "cordova";
  /**
   * Database name.
   */
  database: string;
  /**
   * The driver object
   * This defaults to `window.sqlitePlugin`
   */
  driver?: any;
  /**
   * Storage Location
   */
  location: string;
  poolSize?: never;
}
