import path from "path";
import { ITemplatePlugin } from "../interface";
const constantPath = path.resolve(__dirname, "../../../shared/constant");

export const constantPlugin: ITemplatePlugin[] = [
  {
    defaultName: "EnvironmentConstant",
    author: "Alapajs",
    modulePath: path.resolve(constantPath, "environment.js"),
  },
];
