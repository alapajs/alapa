import { DatabaseConfiguration } from "../config";

export const globalConfig = (databaseConfig: DatabaseConfiguration) => {
  return {
    entities: databaseConfig.entities,
    migrations: databaseConfig.migrations,
    subscribers: databaseConfig.subscribers,
    logging: databaseConfig.logging,
    logger: databaseConfig.logger,
    migrationsTableName: databaseConfig.migrationsTableName,
    migrationsTransactionMode: databaseConfig.migrationsTransactionMode,
    metadataTableName: databaseConfig.metadataTableName,
    maxQueryExecutionTime: databaseConfig.maxQueryExecutionTime,
    name: databaseConfig.name,
    synchronize: databaseConfig.synchronize,
    migrationsRun: databaseConfig.migrationsRun,
    dropSchema: databaseConfig.dropSchema,
    entityPrefix: databaseConfig.entityPrefix,
    entitySkipConstructor: databaseConfig.entitySkipConstructor,
    extra: databaseConfig.extra,
    relationLoadStrategy: databaseConfig.relationLoadStrategy,
    typename: databaseConfig.typename,
    cache: databaseConfig.cache,
    isolateWhereStatements: databaseConfig.isolateWhereStatements,
    poolSize: databaseConfig.poolSize,
  };
};
