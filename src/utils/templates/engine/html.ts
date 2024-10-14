import Handlebars from "handlebars";
import { TemplateEngine } from "./render";

export class HTMLTemplateEngine extends TemplateEngine {
  protected extension = ".html";
  compile(source: string, data?: object): string {
    return Handlebars.compile(source)(data);
  }
}
