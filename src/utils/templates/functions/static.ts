import { Request } from "express";
export const getStaticUrl = (file: string, req: Request) => {
  let host = req.get("x-forwarded-host");
  if (!host) {
    host = req.get("host");
  }
  return `${req.protocol}://${host}/${file}`;
};
