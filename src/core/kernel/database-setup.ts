import { updateDBConnection } from "../../database";
import { Logger } from "../../utils";

export async function setupDatabase() {
  Logger.info("Initializing Database");
  try {
    await updateDBConnection();
    Logger.success("Database Initialized");
  } catch (err: unknown) {
    Logger.error("Database Not Initialized, Error: " + err);
  }
}
