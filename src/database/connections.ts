/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from "typeorm";
import { GlobalConfig } from "../shared/globals";
import { SessionDatabase } from "../data/model";
import { DatabaseConfiguration } from "../config";
import { GeneralSubscriber } from "../data/model-events/general";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const defaultSubscribers = [GeneralSubscriber];

export let DatabaseConnection = new DataSource({
  type: "sqlite",
  database: "test.db",
});

export async function updateDBConnection(
  configuration?: DatabaseConfiguration
) {
  // Ensure previous connection is closed before updating
  if (DatabaseConnection?.isInitialized) {
    await DatabaseConnection.destroy();
  }
  const databaseConfig = configuration ?? GlobalConfig.database;
  const {
    connection,
    removeNullValuesFromIncludesAExcludeFields,
    preventSilentlyDiscardingAttributes,
    ...restConfig
  } = databaseConfig;
  const config = {
    ...restConfig,
    ...connection,
  } as any;

  // Ensure that entities are handled correctly
  if (Array.isArray(config.entities)) {
    // Add or update entities as needed
    if (!config.entities.includes(SessionDatabase)) {
      config.entities.push(SessionDatabase);
    }
  } else {
    // If entities is not an array, initialize it with the new entity
    config.entities = [SessionDatabase];
  }

  if (Array.isArray(config.subscribers)) {
    // Add or update entities as needed

    for (const event of defaultSubscribers) {
      if (!config.subscribers.includes(event)) {
        config.subscribers?.push(event);
      }
    }
  } else {
    // If entities is not an array, initialize it with the new entity
    config.subscribers = [...defaultSubscribers];
  }

  // Initialize the new connection
  DatabaseConnection = new DataSource({
    namingStrategy: new SnakeNamingStrategy(),
    ...config,
  });

  DatabaseConnection = await DatabaseConnection.initialize();
  return DatabaseConnection;
  // console.log("Database connection updated and initialized.");
}

// export default DatabaseConnection;
