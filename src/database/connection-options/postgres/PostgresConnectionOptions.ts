/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
import { ReplicationMode } from "typeorm/driver/types/ReplicationMode";
import { PostgresConnectionCredentialsOptions } from "./PostgresConnectionCredentialsOptions";
/**
 * Postgres-specific connection options.
 */
export interface PostgresConnectionOptions
  extends BaseDataSourceOptions,
    PostgresConnectionCredentialsOptions {
  /**
   * Database type.
   */
  type: "postgres";
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
   * A boolean determining whether to pass time values in UTC or local time. (default: false).
   */
  useUTC?: boolean;
  /**
   * Replication setup.
   */
  replication?: {
    /**
     * Master server used by orm to perform writes.
     */
    master: PostgresConnectionCredentialsOptions;
    /**
     * List of read-from severs (slaves).
     */
    slaves: PostgresConnectionCredentialsOptions[];
    /**
     * Default connection pool to use for SELECT queries
     * @default "slave"
     */
    defaultMode?: ReplicationMode;
  };
  /**
   * The milliseconds before a timeout occurs during the initial connection to the postgres
   * server. If undefined, or set to 0, there is no timeout. Defaults to undefined.
   */
  connectTimeoutMS?: number;
  /**
   * The Postgres extension to use to generate UUID columns. Defaults to uuid-ossp.
   * If pgcrypto is selected, TypeORM will use the gen_random_uuid() function from this extension.
   * If uuid-ossp is selected, TypeORM will use the uuid_generate_v4() function from this extension.
   */
  uuidExtension?: "pgcrypto" | "uuid-ossp";
  poolErrorHandler?: (err: any) => any;
  /**
   * Include notification messages from Postgres server in client logs
   */
  logNotifications?: boolean;
  /**
   * Automatically install postgres extensions
   */
  installExtensions?: boolean;
  /**
   * Return 64-bit integers (int8) as JavaScript integers.
   *
   * Because JavaScript doesn't have support for 64-bit integers node-postgres cannot confidently
   * parse int8 data type results as numbers because if you have a huge number it will overflow
   * and the result you'd get back from node-postgres would not be the result in the database.
   * That would be a very bad thing so node-postgres just returns int8 results as strings and leaves the parsing up to you.
   *
   * Enabling parseInt8 will cause node-postgres to parse int8 results as numbers.
   * Note: the maximum safe integer in js is: Number.MAX_SAFE_INTEGER (`+2^53`)
   *
   * @see [JavaScript Number objects](http://ecma262-5.com/ELS5_HTML.htm#Section_8.5)
   * @see [node-postgres int8 explanation](https://github.com/brianc/node-pg-types#:~:text=on%20projects%3A%20return-,64%2Dbit%20integers,-(int8)%20as)
   * @see [node-postgres defaults.parseInt8 implementation](https://github.com/brianc/node-postgres/blob/pg%408.8.0/packages/pg/lib/defaults.js#L80)
   */
  parseInt8?: boolean;
}
