import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * Sqlite-specific connection options.
 */
export interface BetterSqlite3ConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "better-sqlite3";
  /**
   * Storage type or path to the storage.
   */
  database: string;
  /**
   * The driver object
   * This defaults to require("better-sqlite3")
   */
  driver?: any;
  /**
   * Encryption key for for SQLCipher.
   */
  key?: string;
  /**
   * Cache size of sqlite statement to speed up queries.
   * Default: 100.
   */
  statementCacheSize?: number;
  /**
   * Function to run before a database is used in typeorm.
   * You can set pragmas, register plugins or register
   * functions or aggregates in this function.
   */
  prepareDatabase?: (db: any) => void | Promise<void>;
  /**
   * Open the database connection in mode.
   * Default: false.
   */
  readonly?: boolean;
  /**
   * If the database does not exist, an Error will be thrown instead of creating a new file.
   * This option does not affect in-memory or database connections.
   * Default: false.
   */
  fileMustExist?: boolean;
  /**
   * The number of milliseconds to wait when executing queries
   * on a locked database, before throwing a SQLITE_BUSY error.
   * Default: 5000.
   */
  timeout?: number;
  /**
   * Provide a function that gets called with every SQL string executed by the database connection.
   */
  verbose?: Function;
  /**
   * Relative or absolute path to the native addon (better_sqlite3.node).
   */
  nativeBinding?: string;
  poolSize?: never;
  /**
   * Enables WAL mode. By default its disabled.
   *
   * @see https://www.sqlite.org/wal.html
   */
  enableWAL?: boolean;
}
