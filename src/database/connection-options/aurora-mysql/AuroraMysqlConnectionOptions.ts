/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuroraMysqlConnectionCredentialsOptions } from "./AuroraMysqlConnectionCredentialsOptions";
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * MySQL specific connection options.
 *
 * @see https://github.com/mysqljs/mysql#connection-options
 */
export interface AuroraMysqlConnectionOptions
  extends BaseDataSourceOptions,
    AuroraMysqlConnectionCredentialsOptions {
  /**
   * Database type.
   */
  type: "aurora-mysql";
  region: string;
  secretArn: string;
  resourceArn: string;
  database: string;
  /**
   * The driver object
   * This defaults to require("typeorm-aurora-data-api-driver")
   */
  driver?: any;
  serviceConfigOptions?: {
    [key: string]: any;
  };
  formatOptions?: {
    [key: string]: any;
    castParameters: boolean;
  };
  /**
   * Use spatial functions like GeomFromText and AsText which are removed in MySQL 8.
   * (Default: true)
   */
  legacySpatialSupport?: boolean;
  poolSize?: never;
}
