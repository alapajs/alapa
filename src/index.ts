import "dotenv/config";
export * from "./core/routes";
export * from "./core/";
export * from "./security";
export * from "./utils";
export * from "./shared";
// export * from "./alias";
export * from "./config";
export * from "./data";
export * from "./database";
export * from "./api";
import { default as alapa } from "./core/kernel/index";
export * from "./controller";
export * from "./controller/abstract";
export * from "./models/index";
// export * from "typeorm";

export default alapa;
