/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
class RemoveIfExtension {
  tags = ["macro"];

  parse(parser: any, nodes: any, lexer: any) {
    // Ignore the 'if' tag, effectively removing it
    return new nodes.CallExtension(this, "render", [], []);
  }
}

import { NunJunksLoader } from "../loaders/nunjucks";
import nunjucks from "nunjucks";
export const nunjucksRender = (filePath: string, context?: object): string => {
  const env = new nunjucks.Environment([new NunJunksLoader()], {
    autoescape: true,
    throwOnUndefined: true,
    watch: true,
  });

  const data = env.render(filePath, context);
  return data;
};
