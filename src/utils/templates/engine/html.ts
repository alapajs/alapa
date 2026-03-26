import Handlebars from "handlebars";
import { DEFAULT_TEMPLATE_ENGINE_CONFIG } from "../../../template/constant";
import { TemplateEngine } from "./render";

export class HTMLTemplateEngine extends TemplateEngine {
  protected extension = `.${DEFAULT_TEMPLATE_ENGINE_CONFIG.defaultExtension}`;
  compile(source: string, data?: object): string {
    return Handlebars.compile(source)(data);
  }
}
