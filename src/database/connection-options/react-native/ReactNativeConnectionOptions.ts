import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * Sqlite-specific connection options.
 */
export interface ReactNativeConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "react-native";
  /**
   * Database name.
   */
  database: string;
  /**
   * The driver object
   * This defaults to require("react-native-sqlite-storage")
   */
  driver?: unknown;
  /**
   * Storage Location
   */
  location: string;
  poolSize?: never;
}
