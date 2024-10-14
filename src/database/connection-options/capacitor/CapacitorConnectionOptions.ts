/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * Sqlite-specific connection options.
 */
export interface CapacitorConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "capacitor";
  /**
   * The capacitor-sqlite instance. For example, `new SQLiteConnection(CapacitorSQLite)`.
   */
  driver: any;
  /**
   * Database name (capacitor-sqlite will add the suffix `SQLite.db`)
   */
  database: string;
  /**
   * Set the mode for database encryption
   */
  mode?: "no-encryption" | "encryption" | "secret" | "newsecret";
  /**
   * Database version
   */
  version?: number;
  /**
   * The SQLite journal mode (optional)
   */
  journalMode?: "DELETE" | "TRUNCATE" | "PERSIST" | "MEMORY" | "WAL" | "OFF";
  poolSize?: never;
}
