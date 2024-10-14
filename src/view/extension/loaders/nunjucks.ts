import { ILoader, Loader } from "nunjucks";
import path from "path";
import { Response, Request } from "express";
import { Component } from "../component/main";

export class NunJunksLoader extends Loader implements ILoader {
  req: Request;
  res: Response;
  constructor() {
    super();
  }
  async?: false | undefined;

  getSource(templatePath: string) {
    if (!path.isAbsolute(templatePath)) {
      templatePath = path.resolve("views", templatePath);
    }
    try {
      const template = Component.compileFile(templatePath).toString();
      return {
        src: template,
        path: templatePath,
        noCache: true,
      };
    } catch (e) {
      console.error(`Error loading template: ${templatePath}`);
      return { src: `${e}`, path: templatePath, noCache: true };
    }
  }
}
