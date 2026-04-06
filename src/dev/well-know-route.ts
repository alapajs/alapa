import { Request, Response } from "express";
import path from "path";
export const wellKnownPath =
  process.env.WELL_KNOWN_PATH ||
  "/.well-known/appspecific/com.chrome.devtools.json";
export const wellKnownRoute = (req: Request, res: Response) => {
  const projectRoot = path.resolve();
  const jsonData = {
    workspace: {
      root: projectRoot,
      uuid:
        process.env.WELL_KNOWN_UUID || "71c69dd2-c2e1-48b0-8ca6-3de972359383",
    },
  };
  res.json(jsonData);
};
