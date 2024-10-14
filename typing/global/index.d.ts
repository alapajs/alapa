/* eslint-disable @typescript-eslint/no-explicit-any */
export * from "../express";
// export * from "./express-session";
import "express-session";

declare module "express-session" {
  export interface SessionData {
    [key: string]: any;
    userId: string;
    user: any;
    loginToken?: string;
  }
}
