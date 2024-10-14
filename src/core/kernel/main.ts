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
const server: Express = express();

function alapa(configuration: Configuration): AlapaApp {
  const config = configuration;
  setGlobalConfig(config);

  Logger.info("Initializing ");

  _setupDatabase();

  activateGlobalMiddleware(server, config);
  activateRoutes(server);
  return {
    startServer: async () => {
      updateRouteList();
      _startServer();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      process.on("uncaughtException", async (err: any) => {
        if (err.code === "EADDRINUSE") {
          const port = GlobalConfig.server.port;
          if (port) {
            try {
              Logger.info("Killing port " + port);
              await kill(port);
              Logger.success(`Port ${port} closed`);
              setTimeout(() => _startServer(), 2000);
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

      return server;
    },
  };
}

async function _startServer() {
  const port = GlobalConfig.server.port;
  const host = GlobalConfig.server.host;

  // process.on("unhandledRejection", (reason, promise) => {
  //   console.error(
  //     "my error Unhandled Rejection at:",
  //     promise,
  //     "reason:",
  //     reason
  //   );
  //   // Optionally, you can perform cleanup or logging here
  //   process.exit(1); // Exit the process if necessary
  // });

  if (port && host) {
    server.listen(port, host, () => {
      Logger.info(`Server started at http://${host}:${port}`);
    });
    return;
  }

  if (port) {
    server.listen(port, () => {
      Logger.info(`Server started at port ${port}`);
    });
    return;
  }
  server.listen(() => {
    Logger.info(`Server started`);
  });
}

async function _setupDatabase() {
  Logger.info("Initializing Database");
  try {
    await updateDBConnection();
    // await DataSource.initialize();
    Logger.success("DB Initialized");
  } catch (err: unknown) {
    Logger.error("Database Not Initialized, Error: " + err);
  }
}

export default alapa;
