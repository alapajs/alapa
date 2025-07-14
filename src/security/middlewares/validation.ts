/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Validation } from "../../utils/validation/main";
// Middleware to override res.render
export const validateMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.validate = async (schema: any) => {
    const validate = await Validation.validateData(schema, req.body);
    req.flash("__validation__error__", JSON.stringify(validate));
    return validate as any;
  };
  req.errors = (key?: string) => {
    const errors = JSON.parse(req.flash("__validation__error__")[0]);
    if (key) {
      return errors[key];
    }
    return errors;
  };
  next();
};
