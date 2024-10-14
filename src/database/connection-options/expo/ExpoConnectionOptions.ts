/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * Sqlite-specific connection options.
 */
export interface ExpoConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "expo";
  /**
   * Database name.
   */
  database: string;
  /**
   * Driver module
   */
  driver: any;
  poolSize?: never;
}
