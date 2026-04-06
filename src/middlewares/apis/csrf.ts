import { NextFunction, Request, Response } from "express";

export const passCSRF = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === "EBADCSRFTOKEN") {
    // CSRF token mismatch or missing
    if (req.path.startsWith("/api")) {
      next();
    }
  }
};
