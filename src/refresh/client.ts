/* eslint-disable @typescript-eslint/no-unused-vars */
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined = undefined;

export const refreshClientBrowsers = () => {
  if (!socket) {
    try {
      socket = io("http://localhost:5000", {
        reconnection: true,
        reconnectionAttempts: 5,
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
    console.clear();
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
    console.log("Reloading page due to changes");
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
  refreshClientBrowsers();
}

export const refreshBrowsers = () => {
  try {
    if (!socket) {
      socket = io("http://localhost:5000", {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    // Remove previous listeners to avoid duplicate handlers
    socket.off("connect");
    socket.off("refresh-ready");

    socket.on("connect", () => {
      setTimeout(() => {
        socket!.emit("refresh-ready");
      }, 5000);
    });

    socket.on("disconnect", (reason, details) => {
      // console.log(`Disconnected: ${reason} - ${details}`);
    });
  } catch (error) {
    // console.error(
    //   "Failed to connect to the refresh server on the server:",
    //   error
    // );
  }
};
