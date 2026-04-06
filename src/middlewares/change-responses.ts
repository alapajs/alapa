/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { ApiResponse, getStatusCode } from "../api/response/base";
import { Auth } from "../security/auth";
import { Navigator } from "./navigate/main";
import { ModelHelper } from "../models/helper";
// Middleware to override res.render
export const changeResponses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalJson = res.json;

  res.json = function (data) {
    const modifiedData = ModelHelper.toClient(data);
    // Call the original res.json with the modified data
    return originalJson.call(this, modifiedData);
  };

  res.api = function <T>(response: ApiResponse<T>): Response {
    if ((response as any).data) {
      (response as any).data = ModelHelper.toClient((response as any).data);
    }
    if (!response.code) {
      response = { code: getStatusCode(response.status) ?? 200, ...response };
    }
    return this.status(response.code!).json(response);
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

  res.navigate = new Navigator(req, res);

  next();
};
