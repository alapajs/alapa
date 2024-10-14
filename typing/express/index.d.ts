/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from "express";
import { ApiResponse } from "../../src/api/response/base";
import { LoginResponse } from "../../src/security/auth/main";
declare global {
  namespace Express {
    interface Request {
      authenticated: boolean;
      getRoute: (
        name: string,
        ...param: (string | number | object)[]
      ) => string;
      getUrl: (name: string, ...param: (string | number | object)[]) => string;
      csrfToken: () => string;
      user: any;
      only: (...keys: string[]) => any;
      login: (user: any, remember: boolean = false) => Promise<LoginResponse>;
    }
    interface Response {
      api<T>(response: ApiResponse<T>): any;
    }
  }
}
