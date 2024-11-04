/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * Sqlite-specific connection options.
 */
export interface SqliteConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "sqlite";
  /**
   * Storage type or path to the storage.
   */
  database: string;
  /**
   * The driver object
   * This defaults to require("sqlite3")
   */
  driver?: any;
  /**
   * Encryption key for for SQLCipher.
   */
  key?: string;
  /**
   * In your SQLite application when you perform parallel writes its common to face SQLITE_BUSY error.
   * This error indicates that SQLite failed to write to the database file since someone else already writes into it.
   * Since SQLite cannot handle parallel saves this error cannot be avoided.
   *
   * To simplify life's of those who have this error this particular option sets a timeout within which ORM will try
   * to perform requested write operation again and again until it receives SQLITE_BUSY error.
   *
   * Enabling WAL can improve your app performance and face less SQLITE_BUSY issues.
   * Time in milliseconds.
   */
  busyErrorRetry?: number;
  /**
   * Enables WAL mode. By default its disabled.
   *
   * @see https://www.sqlite.org/wal.html
   */
  enableWAL?: boolean;
  /**
   * Specifies the open file flags. By default its undefined.
   * @see https://www.sqlite.org/c3ref/c_open_autoproxy.html
   * @see https://github.com/TryGhost/node-sqlite3/blob/master/test/open_close.test.js
   */
  flags?: number;
  poolSize?: never;
  /**
   * Query or change the setting of the busy timeout.
   * Time in milliseconds.
   *
   * @see https://www.sqlite.org/pragma.html#pragma_busy_timeout
   */
  busyTimeout?: number;
}