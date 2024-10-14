/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * NativeScript-specific connection options.
 */
export interface NativescriptConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "nativescript";
  /**
   * Database name.
   */
  database: string;
  /**
   * The driver object
   * you should pass `require('nativescript-sqlite') here
   */
  driver: any;
  /**
   * Whether to mark the mark the database as read only on open (iOS only).
   */
  readOnly?: boolean;
  /**
   * The key to use for for using/opening encrypted databases. (requires the "Encrypted Plugin")
   */
  key?: string;
  /**
   * Whether to enable background multitasking. All SQL is ran on a background worker thread. (requires the "Commercial Plugin")
   */
  multithreading?: boolean;
  /**
   * Migrates a Encrypted Sql database from v3 to the new v4. If you are a new user you do not need to set this flag as new created databases will already be in v4.
   * If you are upgrading a app that used v1.3.0 or earlier of NS-Sqlite-Encrypted; then you will probably want to set this flag to true. (requires the "Encrypted Plugin")
   */
  migrate?: boolean;
  /**
   * Flags to pass to SQLite when opening the database on iOS. (see https://www.sqlite.org/c3ref/open.html)
   */
  iosFlags?: number;
  /**
   * Flags to pass to SQLite when opening the database on Android. (see https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase.html)
   */
  androidFlags?: number;
  poolSize?: never;
}
