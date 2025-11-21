/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Logger } from "../../../utils";
import { JWT } from "../../../api";
import { HTTP_STATUS } from "../../../interface";

export const bearerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Authenticate using Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const payload = await JWT.verify(token);
      // const checkAuth = await UserAuthController.verifyPayload(payload);

      if (payload) {
        req.auth.api.bearerToken = token;
        // req.auth.api.jwtPayload = payload;
        next();
      } else {
        return res.api({
          code: 401,
          status: HTTP_STATUS.UNAUTHORIZED,
          message: "Unauthorized: Bearer token is invalid",
        });
      }
    } catch (error: any) {
      Logger.error(error);
      return res.api({
        code: 401,
        status: HTTP_STATUS.ERROR,
        message: "Unauthorized: Invalid or expired token",
      });
    }
  } else {
    return res.api({
      code: 401,
      status: "success",
      message:
        "Unauthorized: Bearer Authentication is required for this operation",
    });
  }
};
