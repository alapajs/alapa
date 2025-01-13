import express from "express";
import http from "http";
import { Server } from "socket.io";

export const startRefreshServer = () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  server.listen(5000, function () {
    console.log("Refresh server started on port 5000");
  });

  io.on("connection", (socket) => {
    console.log("A client connected");

    // Join the refresh room
    socket.join("refresh");

    socket.on("refresh-ready", () => {
      console.log("Client requesting refresh");
      io.to("refresh").emit("refresh", "Refreshing browser(s) now...");
    });

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });
};
