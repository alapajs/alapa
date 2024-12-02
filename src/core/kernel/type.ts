import express from "express";
import http from "http";
export interface AppData {
  port?: number;
  host?: string;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  app: express.Express;
}
export interface AlapaApp {
  startServer: () => Promise<AppData>;
}
