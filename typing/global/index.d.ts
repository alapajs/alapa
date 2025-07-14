/* eslint-disable @typescript-eslint/no-explicit-any */
export * from "../express";
// export * from "./express-session";
import "express-session";
import { Model } from "../../dist/models";

declare module "express-session" {
  export interface SessionData {
    [key: string]: any;
    userId: string;
    user: any;
    loginToken?: string;
  }
}

declare module "zod" {
  interface ZodType {
    unique<T extends Model | string>(modelClass: T, message?: string): ZodType;
  }
}
