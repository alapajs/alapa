import path from "path";
import { ITemplatePlugin } from "../interface";
const utilsPath = path.resolve(__dirname, "../../../utils");

export const miscPlugin: ITemplatePlugin[] = [
  {
    defaultName: "Utils",
    author: "Alapajs",
    modulePath: path.resolve(utilsPath, "mics.js"),
  },

  {
    defaultName: "Utils",
    author: "Alapajs",
    modulePath: path.join(utilsPath, "value-assertions.js"),
  },

  {
    defaultName: "StringsUtils",
    author: "Alapajs",
    modulePath: path.join(utilsPath, "string.js"),
  },
];
