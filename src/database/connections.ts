import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { GlobalConfig } from "../shared/globals";
import { SessionDatabase } from "../data/model";
import { globalConfig } from "./global-config";
import { DatabaseConfiguration } from "../config";

let DatabaseConnection = new DataSource({
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

  const config = {
    ...globalConfig(databaseConfig),
    ...databaseConfig.connection,
  };

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

  // Initialize the new connection
  DatabaseConnection = new DataSource({
    ...config,
    namingStrategy: new SnakeNamingStrategy(),
  });

  await DatabaseConnection.initialize();
  return DatabaseConnection;
  // console.log("Database connection updated and initialized.");
}

export default DatabaseConnection;
