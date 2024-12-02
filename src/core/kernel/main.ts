import { Configuration } from "../../config";
import { updateDBConnection } from "../../database/connections";
import { activateGlobalMiddleware } from "../../security/middlewares/map";
import { GlobalConfig, setGlobalConfig } from "../../shared/globals";
import { Logger } from "../../utils";
import { activateRoutes } from "./activate-routes";
import express, { Express } from "express";
import kill from "kill-port";
import { AlapaApp } from "./type";
import { updateRouteList } from "../routes/handlers/list";
import http from "http";

const app: Express = express();
const server = http.createServer(app);

function alapa(configuration: Configuration): AlapaApp {
  const config = configuration;
  setGlobalConfig(config);
  Logger.info("Initializing ");
  activateGlobalMiddleware(app, config);
  activateRoutes(app);
  updateRouteList();
  return {
    startServer: async () => {
      await _setupDatabase();
      const { host, port } = await _startServer();
      return { server, app, host, port }; // Return the app, host, and port
    },
  };
}

async function _startServer(): Promise<{ host?: string; port?: number }> {
  const port = GlobalConfig.server.port;
  const host = GlobalConfig.server.host;

  // Ensure that port is available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  process.on("uncaughtException", async (err: any) => {
    if (err.code === "EADDRINUSE") {
      if (port) {
        try {
          Logger.info("Killing port " + port);
          await kill(port);
          Logger.success(`Port ${port} closed`);
          setTimeout(async () => {
            const { host, port } = await _startServer();
            return { host, port }; // Return values if restarted
          }, 2000);
        } catch (error) {
          Logger.log(`Error killing port ${port}: ${error}`);
          process.exit(1);
        }
      }
    } else {
      Logger.error("Server error:", err);
      process.exit(1);
    }
  });

  if (port && host) {
    return new Promise((resolve) => {
      server.listen(port, host, () => {
        Logger.info(`Server started at http://${host}:${port}`);
        resolve({ host, port });
      });
    });
  }

  if (port) {
    return new Promise((resolve) => {
      server.listen(port, () => {
        Logger.info(`Server started at port ${port}`);
        resolve({ host: undefined, port });
      });
    });
  }

  return new Promise((resolve) => {
    server.listen(() => {
      Logger.info(`Server started`);
      resolve({ host: undefined, port: 3000 }); // Default host and port if none specified
    });
  });
}

async function _setupDatabase() {
  Logger.info("Initializing Database");
  try {
    await updateDBConnection();
    Logger.success("DB Initialized");
  } catch (err: unknown) {
    Logger.error("Database Not Initialized, Error: " + err);
  }
}

export default alapa;
