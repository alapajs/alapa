import { CockroachConnectionOptions } from "./cockroachdb/CockroachConnectionOptions";
import { MysqlConnectionOptions } from "./mysql/MysqlConnectionOptions";
import { PostgresConnectionOptions } from "./postgres/PostgresConnectionOptions";
import { SqliteConnectionOptions } from "./sqlite/SqliteConnectionOptions";
import { SqlServerConnectionOptions } from "./sqlserver/SqlServerConnectionOptions";
import { OracleConnectionOptions } from "./oracle/OracleConnectionOptions";
import { MongoConnectionOptions } from "./mongodb/MongoConnectionOptions";
import { CordovaConnectionOptions } from "./cordova/CordovaConnectionOptions";
import { SqljsConnectionOptions } from "./sqljs/SqljsConnectionOptions";
import { ReactNativeConnectionOptions } from "./react-native/ReactNativeConnectionOptions";
import { NativescriptConnectionOptions } from "./nativescript/NativescriptConnectionOptions";
import { ExpoConnectionOptions } from "./expo/ExpoConnectionOptions";
import { AuroraMysqlConnectionOptions } from "./aurora-mysql/AuroraMysqlConnectionOptions";
import { SapConnectionOptions } from "./sap/SapConnectionOptions";
import { AuroraPostgresConnectionOptions } from "./aurora-postgres/AuroraPostgresConnectionOptions";
import { BetterSqlite3ConnectionOptions } from "./better-sqlite3/BetterSqlite3ConnectionOptions";
import { CapacitorConnectionOptions } from "./capacitor/CapacitorConnectionOptions";
import { SpannerConnectionOptions } from "./spanner/SpannerConnectionOptions";
/**
 * DataSourceOptions is an interface with settings and options for specific DataSource.
 */
export type DataSourceOptions =
  | MysqlConnectionOptions
  | PostgresConnectionOptions
  | CockroachConnectionOptions
  | SqliteConnectionOptions
  | SqlServerConnectionOptions
  | SapConnectionOptions
  | OracleConnectionOptions
  | CordovaConnectionOptions
  | NativescriptConnectionOptions
  | ReactNativeConnectionOptions
  | SqljsConnectionOptions
  | MongoConnectionOptions
  | AuroraMysqlConnectionOptions
  | AuroraPostgresConnectionOptions
  | ExpoConnectionOptions
  | BetterSqlite3ConnectionOptions
  | CapacitorConnectionOptions
  | SpannerConnectionOptions;
