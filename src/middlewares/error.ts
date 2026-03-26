import fs from "fs";
import { Request, Response } from "express";
import { GlobalConfig } from "../shared/globals";
import { empty } from "../utils";
import { DEFAULT_TEMPLATE_ENGINE_CONFIG } from "../template/constant";
export const notFound = (req: Request, res: Response) => {
  let extensions: string[] = [];
  const extensionsConfig = GlobalConfig.templateEngine.fileExtensions;
  if (typeof extensionsConfig == "string") {
    extensions = extensionsConfig.split(",").map((ext: string) => ext.trim());
  } else {
    extensions = extensionsConfig
      ? extensionsConfig
      : [DEFAULT_TEMPLATE_ENGINE_CONFIG.defaultExtension];
  }
  let errorTemplate = "";
  for (let ext of extensions) {
    ext = ext.trim().replace(/[^a-zA-Z0-9]+/g, "");
    if (fs.existsSync(`views/errors/404.${ext}`)) {
      errorTemplate += `errors/404.${ext}`;
      break;
    }
  }
  if (!empty(errorTemplate)) {
    res.status(404).render(errorTemplate);
  } else {
    res.status(404).send("Not found");
  }
};
