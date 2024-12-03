/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  DataSource,
  EntitySchema,
  LoggerOptions,
  MixedList,
  Logger,
  NamingStrategyInterface,
} from "typeorm";
import { QueryResultCache } from "typeorm/cache/QueryResultCache";

import { DatabaseConnection } from "../database";

export type DatabaseConfiguration = {
  connection: DatabaseConnection;
  /**
   * Connection name. If connection name is not given then it will be called "default".
   * Different connections must have different names.
   *
   * @deprecated
   */
  name?: string;
  /**
   * Entities to be loaded for this connection.
   * Accepts both entity classes and directories where from entities need to be loaded.
   * Directories support glob patterns.
   */
  entities?: MixedList<Function | string | EntitySchema>;
  /**
   * Subscribers to be loaded for this connection.
   * Accepts both subscriber classes and directories where from subscribers need to be loaded.
   * Directories support glob patterns.
   */
  subscribers?: MixedList<Function | string>;
  /**
   * Migrations to be loaded for this connection.
   * Accepts both migration classes and glob patterns representing migration files.
   */
  migrations?: MixedList<Function | string>;
  /**
   * Migrations table name, in case of different name from "migrations".
   * Accepts single string name.
   */
  migrationsTableName?: string;
  /**
   * Transaction mode for migrations to run in
   */
  migrationsTransactionMode?: "all" | "none" | "each";
  /**
   * Typeorm metadata table name, in case of different name from "typeorm_metadata".
   * Accepts single string name.
   */
  metadataTableName?: string;
  /**
   * Naming strategy to be used to name tables and columns in the database.
   */
  namingStrategy?: NamingStrategyInterface;
  /**
   * Logging options.
   */
  logging?: LoggerOptions;
  /**
   * Logger instance used to log queries and events in the ORM.
   */
  logger?: "advanced-console" | "simple-console" | "file" | "debug" | Logger;
  /**
   * Maximum number of milliseconds query should be executed before logger log a warning.
   */
  maxQueryExecutionTime?: number;
  /**
   * Maximum number of clients the pool should contain.
   */
  poolSize?: any;
  /**
   * Indicates if database schema should be auto created on every application launch.
   * Be careful with this option and don't use this in production - otherwise you can lose production data.
   * This option is useful during debug and development.
   * Alternative to it, you can use CLI and run schema:sync command.
   *
   * Note that for MongoDB database it does not create schema, because MongoDB is schemaless.
   * Instead, it syncs just by creating indices.
   */
  synchronize?: boolean;
  /**
   * Indicates if migrations should be auto run on every application launch.
   * Alternative to it, you can use CLI and run migrations:run command.
   */
  migrationsRun?: boolean;
  /**
   * Drops the schema each time connection is being established.
   * Be careful with this option and don't use this in production - otherwise you'll lose all production data.
   * This option is useful during debug and development.
   */
  dropSchema?: boolean;
  /**
   * Prefix to use on all tables (collections) of this connection in the database.
   */
  entityPrefix?: string;
  /**
   * When creating new Entity instances, skip all constructors when true.
   */
  entitySkipConstructor?: boolean;
  /**
   * Extra connection options to be passed to the underlying driver.
   *
   * todo: deprecate this and move all database-specific types into hts own connection options object.
   */
  extra?: any;
  /**
   * Specifies how relations must be loaded - using "joins" or separate queries.
   * If you are loading too much data with nested joins it's better to load relations
   * using separate queries.
   *
   * Default strategy is "join", but this default can be changed here.
   * Also, strategy can be set per-query in FindOptions and QueryBuilder.
   */
  relationLoadStrategy?: "join" | "query";
  /**
   * Optionally applied "typename" to the model.
   * If set, then each hydrated model will have this property with the target model / entity name inside.
   *
   * (works like a discriminator property).
   */
  typename?: string;
  /**
   * Allows to setup cache options.
   */
  cache?:
    | boolean
    | {
        /**
         * Type of caching.
         *
         * - "database" means cached values will be stored in the separate table in database. This is default value.
         * - "redis" means cached values will be stored inside redis. You must provide redis connection options.
         */
        type?: "database" | "redis" | "ioredis" | "ioredis/cluster";
        /**
         * Factory function for custom cache providers that implement QueryResultCache.
         */
        provider?: (connection: DataSource) => QueryResultCache;
        /**
         * Configurable table name for "database" type cache.
         * Default value is "query-result-cache"
         */
        tableName?: string;
        /**
         * Used to provide redis connection options.
         */
        options?: any;
        /**
         * If set to true then queries (using find methods and QueryBuilder's methods) will always be cached.
         */
        alwaysEnabled?: boolean;
        /**
         * Time in milliseconds in which cache will expire.
         * This can be setup per-query.
         * Default value is 1000 which is equivalent to 1 second.
         */
        duration?: number;
        /**
         * Used to specify if cache errors should be ignored, and pass through the call to the Database.
         */
        ignoreErrors?: boolean;
      };
  /**
   * Allows automatic isolation of where clauses
   */
  isolateWhereStatements?: boolean;
};
