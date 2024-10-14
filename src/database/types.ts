import { DataSourceOptions } from "./connection-options";

export type DatabaseConnection = DataSourceOptions;

export type DatabaseConnectionList = { [key: string]: DatabaseConnection };
