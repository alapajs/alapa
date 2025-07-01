import { DataSourceOptions } from "typeorm";

export type DatabaseConnection = DataSourceOptions;

export type DatabaseConnectionList = { [key: string]: DatabaseConnection };
