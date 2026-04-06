import { Request } from "express";
export const oldRequest = (
  req: Request,
  value?: string,
  defaultValue?: unknown
) => {
  if (value === undefined && defaultValue === undefined) {
    return req.body;
  }
  if (value) {
    if (req.body[value]) {
      return req.body[value];
    }
  }
  if (defaultValue) {
    return defaultValue;
  }
  return "";
};
