import { Express } from "express";
import { alapaEngine } from "../../template/engine";

export const setViews = (server: Express) => {
  server.engine("html", alapaEngine);
  server.set("view engine", "html");
  server.set("views", "views");
};
