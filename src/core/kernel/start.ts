/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalConfig } from "../../shared/globals";
import http from "http";
import express, { Express } from "express";
import { Logger } from "../../utils";
import kill from "kill-port";
const app: Express = express();
const server = http.createServer(app);
export interface StartResponse {
  host?: string;
  port?: number;
  app: Express;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
}

export async function startServer(): Promise<StartResponse> {
  const port = GlobalConfig.server.port;
  const host = GlobalConfig.server.host;

  process.on("uncaughtException", async (err: any) => {
    Logger.error(`Error binding to port ${port}: ${err?.message}`);
    if (err) {
      if (err.code === "EADDRINUSE") {
        if (port) {
          // console.log(`Port ${port} is in use, trying a different port...`);
          // // Attempt to listen on a new port (you can specify your logic)
          // server.listen(port + 1);
          try {
            Logger.info("Killing port " + port);
            await kill(port);
            Logger.success(`Port ${port} closed`);
            Logger.info("Releasing port " + port);
            setTimeout(async () => {
              const { host, port } = await startServer();
              return { host, port, server, app }; // Return values if restarted
            }, 4000);
          } catch (error) {
            Logger.log(`Error killing port ${port}: ${error}`);
            process.exit(1);
          }
        }
      } else {
        console.error("Server error:", err);
      }
    } else {
      console.log(`Server running on port ${port}`);
    }
  });
  // Ensure that port is available
  //// eslint-disable-next-line @typescript-eslint/no-explicit-any
  // process.on("uncaughtException", async (err: any) => {
  //   if (err.code === "EADDRINUSE") {
  //
  //   } else {
  //     Logger.error("Server error:", err);
  //     process.exit(1);
  //   }
  // });

  if (port && host) {
    return new Promise((resolve) => {
      server.listen(port, host, (err?: NodeJS.ErrnoException) => {
        if (err) {
          // handlerPortError(err, port);
        } else {
          Logger.info(`Server started at http://${host}:${port}`);
          resolve({ host, port, server, app });
        }
      });
    });
  }

  if (port) {
    return new Promise((resolve) => {
      server.listen(port, (err?: NodeJS.ErrnoException) => {
        if (err) {
          // handlerPortError(err, port);
        } else {
          Logger.info(`Server started at port ${port}`);
          resolve({ host: undefined, port, server, app });
        }
      });
    });
  }

  return new Promise((resolve) => {
    server.listen((err?: NodeJS.ErrnoException) => {
      if (err) {
        Logger.error(err);
      } else {
        Logger.info(`Server started`);
        resolve({ host: undefined, port: 3000, server, app }); // Default host and port if none specified
      }
    });
  });
}
