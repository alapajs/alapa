/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../api/response/base";
import { Auth } from "../auth";
import { renderFile } from "../../view/extension/render/main";

// Middleware to override res.render
export const changeResponses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.render = function (
    view: string,
    options?: object | { (err: Error, html: string): void },
    callback?: (err: Error | any, html: string) => void
  ) {
    let result: string;
    const context = res.locals;
    // If options is not a function, it's an object
    if (typeof options === "object" && typeof options !== "function") {
      result = renderFile(view, {
        ...context,
        ...options,
      });
      if (callback) {
        callback(null, result);
      }
    }
    result = renderFile(view, context);

    if (typeof options === "function") {
      // If options is a function, it's the callback
      options(null, result);
    }

    return res.send(result);
  };

  res.api = function <T>(response: ApiResponse<T>): Response {
    return this.status(
      response.status === "success" ? 200 : response.code ?? 400
    ).json(response);
  };
  req.only = (...keys: string[]) => {
    const data: any = {};
    for (const key of keys) {
      data[key] = req.body[key];
    }
    return data;
  };

  req.login = async (user: any, remember: boolean = false) =>
    await Auth.login(user, req, res, remember);
  next();
};

declare module "express" {
  export interface Response {
    render: (
      view: string,
      options?: object,
      callback?: (err: Error, html: string) => void
    ) => void;
  }
}
