import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Logger } from "../../utils";
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
  server.listen(port, function () {
    Logger.success("Dev server started on port " + port);
  });

  io.on("connection", (socket) => {
    // console.log("A client connected");

    // Join the refresh room
    socket.join("refresh");

    socket.on("changes", () => {
      // console.log("Client requesting refresh");
      io.to("refresh").emit("refresh", "Refreshing browser(s) now...");
    });

    socket.on("disconnect", () => {
      // console.log("A client disconnected");
    });
  });
};
