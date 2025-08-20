import { DataSourceOptions } from "typeorm";
export interface DatabaseConfiguration extends Omit<DataSourceOptions, "type"> {
  connection: DataSourceOptions;
  preventSilentlyDiscardingAttributes?: boolean;
  removeNullValuesFromIncludesAExcludeFields?: boolean;
}
