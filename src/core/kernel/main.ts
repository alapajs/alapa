import { Configuration } from "../../config";
import { GlobalConfig } from "../../shared/globals";
import { AlapaApp } from "./type";
import { startServer } from "./start";
import { setupDatabase } from "./database-setup";
import { activateApp, boot } from "./boot";

function alapa(configuration: Configuration): AlapaApp {
  boot(configuration);
  return {
    startServer: async (userHost?: string, userPort?: number) => {
      if (userHost) {
        GlobalConfig.server.host = userHost;
      }
      if (userPort) {
        GlobalConfig.server.port = userPort;
      }
      await setupDatabase();
      const { host, port, server, app } = await startServer();
      activateApp(app);
      return { server, app, host, port }; // Return the app, host, and port
    },
  };
}

export default alapa;
