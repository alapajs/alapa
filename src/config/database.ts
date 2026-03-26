import { DataSourceOptions } from "typeorm";
export interface DatabaseConfiguration extends Omit<DataSourceOptions, "type"> {
  /** Database connection configuration */
  connection: DataSourceOptions;
  /** Prevent silently discarding attributes */
  preventSilentlyDiscardingAttributes?: boolean;
  /** Remove null values from includes and exclude fields */
  removeNullValuesFromIncludesAExcludeFields?: boolean;
}
