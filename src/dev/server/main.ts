import express from "express";
import http from "http";
import { Server } from "socket.io";
import { exec, execSync } from "child_process";
import os from "os";

import { Logger } from "../../utils";

// Flag to track if browser is already opened

/**
 * Starts the development WebSocket server with refresh support.
 */
export const startDevServer = () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const port = Number(process.env.DEV_SERVER_PORT || "35730");

  server.listen(port, () => {
    Logger.success(`Dev server started on port ${port}`);
  });

  io.on("connection", (socket) => {
    const userAgent = socket.handshake.headers["user-agent"];
    // Join the refresh room if not XMLHttpRequest from Node
    if (userAgent !== "node-XMLHttpRequest") {
      socket.join("refresh");
    }

    socket.on("changes", () => {
      if (getRefreshClientCount(io) > 0) {
        triggerBrowserRefresh(io);
      } else {
        openBrowserIfNoneConnected(io);
      }
    });

    socket.on("disconnect", () => {});
  });
};

/**
 * Opens the browser if no clients are connected to the refresh room.
 */
let browserOpened = false;

const openBrowserIfNoneConnected = (io: Server) => {
  if (browserOpened) return;

  setTimeout(() => {
    if (getRefreshClientCount(io) === 0) {
      const port = process.env.PORT ?? "3000";
      const command = getBrowserLaunchCommand(`http://localhost:${port}`);
      if (isBrowserOpenable() && command) {
        exec(command);
        browserOpened = true;
      }
    }
  }, 2000);
};
/**
 * Returns the number of clients in the "refresh" room.
 */
const getRefreshClientCount = (io: Server): number => {
  const room = io.sockets.adapter.rooms.get("refresh");
  return room ? room.size : 0;
};

/**
 * Emits a refresh event to all clients in the "refresh" room.
 */
const triggerBrowserRefresh = (io: Server) => {
  io.to("refresh").emit("refresh", "Refreshing browser(s) now...");
};

const isBrowserOpenable = (): boolean => {
  try {
    switch (os.platform()) {
      case "linux":
        execSync("which xdg-open", { stdio: "ignore" });
        break;
      case "darwin":
        execSync("which open", { stdio: "ignore" });
        break;
      case "win32":
        return true; // `start` is always available as a shell builtin
    }
    return true;
  } catch {
    return false;
  }
};

function getBrowserLaunchCommand(url: string): string | null {
  switch (os.platform()) {
    case "win32":
      return `cmd /c start "" "${url}"`; // ensure cmd handles it
    case "darwin":
      return `open "${url}"`;
    case "linux":
      return `xdg-open "${url}"`;
    default:
      return null;
  }
}
