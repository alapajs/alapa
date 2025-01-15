/* eslint-disable @typescript-eslint/no-unused-vars */
import { io, Socket } from "socket.io-client";
let socket: Socket | undefined = undefined;
const port: number = Number(process.env.DEV_SERVER_PORT || 5000);

/**
 * The `joinRefreshSocket` function establishes a WebSocket connection
 * to a local refresh server (usually for development purposes). It listens
 * for a "refresh" event and triggers a page reload when the event is received.
 * This is typically used in development to automatically refresh the page
 * in response to changes detected by the development server.
 *
 * The function ensures that:
 * - A connection to the WebSocket server is established, reconnecting if necessary.
 * - Listeners are set up to handle events such as connection, disconnection, and refresh.
 * - The socket is properly cleaned up by removing previous listeners to avoid duplication.
 * - On disconnect, it tries to reconnect to the server.
 *
 * The WebSocket connection is closed when the user navigates away from the page
 * (`beforeunload` event).
 *
 * This function should only be invoked in the development environment, as the
 * page refresh mechanism is primarily intended for use during development.
 */
export const joinRefreshSocket = () => {
  if (!socket) {
    try {
      socket = io("http://localhost:" + port, {
        reconnection: true,
        reconnectionDelay: 1000,
        transports: ["polling", "websocket"],
      });
    } catch (error) {
      // console.error("Error while connecting to the refresh server:", error);
    }
  }
  if (!socket) return;
  // client-side
  socket.on("connect_error", () => {
    // console.clear();
  });
  // Remove previous listeners to avoid duplicate handlers
  socket.off("connect");
  socket.off("disconnect");
  socket.off("refresh");

  socket.on("connect", () => {
    // console.log("Connected to the refresh server");
  });

  socket.on("disconnect", (reason, details) => {
    // console.log(`Disconnected: ${reason} - ${details}`);
    socket = undefined;
    reconnect();
  });

  socket.on("refresh", (data) => {
    console.log(data);
    location.reload();
  });

  window.addEventListener("beforeunload", () => {
    if (socket) {
      socket.disconnect();
    }
  });
};

function reconnect() {
  if (!socket || socket.connected) return; // Skip if already connected
  joinRefreshSocket();
}

export const refreshBrowsers = () => {
  try {
    const refreshClientSocket = io("http://localhost:" + port, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Remove previous listeners to avoid duplicate handlers
    refreshClientSocket.off("connect");
    refreshClientSocket.off("disconnect");

    refreshClientSocket.on("connect", () => {
      refreshClientSocket.emit("changes");
      setTimeout(() => {
        refreshClientSocket.disconnect();
      }, 5000);
    });

    refreshClientSocket.on("disconnect", (reason, details) => {
      // console.log(`Disconnected: ${reason} - ${details}`);
    });
  } catch (error) {
    // console.error(
    //   "Failed to connect to the refresh server on the server:",
    //   error
    // );
  }
};
