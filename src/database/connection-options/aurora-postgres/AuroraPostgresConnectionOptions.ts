import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * Postgres-specific connection options.
 */
export interface AuroraPostgresConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "aurora-postgres";
  region: string;
  secretArn: string;
  resourceArn: string;
  database: string;
  /**
   * The driver object
   * This defaults to require("typeorm-aurora-data-api-driver")
   */
  driver?: any;
  /**
   * The Postgres extension to use to generate UUID columns. Defaults to uuid-ossp.
   * If pgcrypto is selected, TypeORM will use the gen_random_uuid() function from this extension.
   * If uuid-ossp is selected, TypeORM will use the uuid_generate_v4() function from this extension.
   */
  uuidExtension?: "pgcrypto" | "uuid-ossp";
  transformParameters?: boolean;
  poolErrorHandler?: (err: any) => any;
  serviceConfigOptions?: {
    [key: string]: any;
  };
  formatOptions?: {
    [key: string]: any;
    castParameters: boolean;
  };
  poolSize?: never;
}
