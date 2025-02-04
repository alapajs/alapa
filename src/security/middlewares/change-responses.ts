/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../api/response/base";
import { Auth } from "../auth";
import { navigatorChainFunction } from "./navigate/main";
// Middleware to override res.render
export const changeResponses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.api = function <T>(response: ApiResponse<T>): Response {
    return this.status(
      response.status === "success" ? 200 : (response.code ?? 200)
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

  res.navigate = navigatorChainFunction(req, res); // Create the chain

  next();
};
