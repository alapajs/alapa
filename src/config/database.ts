/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { DataSourceOptions } from "typeorm";

export interface DatabaseConfiguration extends Omit<DataSourceOptions, "type"> {
  connection: DataSourceOptions;
  preventSilentlyDiscardingAttributes?: boolean;
  removeNullValuesFromIncludesAExcludeFields?: boolean;
}
