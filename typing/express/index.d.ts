/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from "express";
import { ApiResponse } from "../../src/api/response/base";
import { LoginResponse } from "../../src/security/auth/main";
import { AuthData } from "../../src/security/auth/data";
import session from "express-session";
import { NavigatorChain } from "../../src/security/middlewares/navigate/interface";
export interface SessionData {
  [key: string]: any;
  cookie: Cookie;
  userId: string;
  user: any;
  loginToken: string;
}
declare global {
  namespace Express {
    interface Request {
      authenticated: boolean;
      files?: {
        [fieldName: string]:
          | Express.Multer.File
          | Express.Multer.File[]
          | undefined;
      };
      getRoute: (
        name: string,
        ...param: (string | number | object)[]
      ) => string;
      getUrl: (name: string, ...param: (string | number | object)[]) => string;
      csrfToken: () => string;
      auth: AuthData;
      user: any;
      only: (...keys: string[]) => any;
      login: (user: any, remember: boolean = false) => Promise<LoginResponse>;
      flash: any;
      flash(): { [key: string]: string[] };
      flash(message: string): string[];
      flash(type: string, message: string[] | string): number;
      flash(type: string, format: string, ...args: any[]): number;
      session: session.Session & Partial<SessionData>;

      /**
       * This request's session ID.
       * Even though this property isn't marked as optional, it won't exist until you use the `express-session` middleware
       */
      sessionID: string;

      /**
       * The Store in use.
       * Even though this property isn't marked as optional, it won't exist until you use the `express-session` middleware
       * The function `generate` is added by express-session
       */
      sessionStore: SessionStore;
    }
    interface Response {
      api<T>(response: ApiResponse<T>): any;
      navigate: NavigatorChain;
    }
  }
}
