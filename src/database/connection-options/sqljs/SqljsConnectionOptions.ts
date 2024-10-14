/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * Sql.js-specific connection options.
 */
export interface SqljsConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "sqljs";
  /**
   * A Uint8Array that gets imported when the connection is opened.
   */
  database?: Uint8Array;
  /**
   * The driver object
   * This defaults to require("sql.js")
   */
  driver?: any;
  /**
   * Config that's used to initialize sql.js.
   */
  sqlJsConfig?: any;
  /**
   * Enables the autoSave mechanism which either saves to location
   * or calls autoSaveCallback every time a change to the database is made.
   */
  autoSave?: boolean;
  /**
   * A function that gets called on every change instead of the internal autoSave function.
   * autoSave has to be enabled for this to work.
   */
  autoSaveCallback?: Function;
  /**
   * File path (Node.js) or local storage key (browser) to load and save database from.
   * If this is specified without autoSave, the database is loaded from the location
   * and can be saved manually via the SqljsEntityManager. If autoSave is enabled,
   * location is used to automatically save the database.
   */
  location?: string;
  /**
   * Enables the usage of the localforage library to save & load the database asynchronously from the
   * indexedDB instead of using the synchron local storage methods in a browser environment.
   */
  useLocalForage?: boolean;
  poolSize?: never;
}
