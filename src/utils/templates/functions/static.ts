import { Request } from "express";
export const getStaticUrl = (file: string, req: Request) => {
  return `${req.protocol}://${req.get("host")}/${file}`;
};
