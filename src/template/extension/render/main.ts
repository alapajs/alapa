import { TemplateEngine } from "../../render";

export const renderFile = (filePath: string, context?: object): string => {
  return TemplateEngine.renderFile(filePath, context);
};
