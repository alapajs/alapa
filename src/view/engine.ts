import { AnyObject } from "../interface/object";
import { Logger } from "../utils";
import { Component } from "./extension/component/main";
import { Include } from "./extension/include";
import { outPutVariable } from "./output";
import { codeRegex, importRegex, noCodeRegex } from "./regex/misc";
import { escapeCode, escapeHTML, removeCommentsFromCode } from "./utils";
import fs from "fs";

export class TemplateEngine {
  static compile(template: string, context?: AnyObject) {
    template = removeCommentsFromCode(template);
    template = Include.render(template);
    let outputOfTemplateEngine = "";

    function addOutPutToTemplateEngine(output: string = "") {
      outputOfTemplateEngine += output;
    }
    const getOutPutToTemplateEngine = () => outputOfTemplateEngine;

    context = context || {};

    context["addOutPutToTemplateEngine"] = addOutPutToTemplateEngine;
    context["getOutPutToTemplateEngine"] = getOutPutToTemplateEngine;
    context["escapeHTML"] = escapeHTML;
    // Clean up the template
    template = template.replace(importRegex, "");
    template = outPutVariable(template);
    template = template.replace(codeRegex, (match, codeBlock) => {
      return `</no-code>${codeBlock}<no-code>`;
    });
    template = `<no-code>${template}</no-code>`;

    // Escape HTML and prepare the output
    template = template.replace(noCodeRegex, (match, html) => {
      html = escapeCode(html);
      return `;addOutPutToTemplateEngine(\`${html}\`);`;
    });

    // Prepare the function with the context directly accessible
    template = `${template} return getOutPutToTemplateEngine()`;

    const output = new Function(
      `return (function() {
                  for (const key in this) {
                      global[key] = this[key];
                  }
                      ${template}
              }).apply(this);
          `
    ).call(context);

    template = template.replace(/\[\[\s?(.*?)\s?\]\]/g, (match, key) => {
      try {
        const value = `{% addOutPutToTemplateEngine(\`$\{${key}}\`); %}`;
        return value;
      } catch (e) {
        Logger.error(`Error while processing template: ${e}`);
        return "";
      }
    });
    return output !== undefined ? output : "";
  }

  static renderString(template: string, context?: object): string {
    return this.compile(template, context);
  }

  static getTemplate(templatePath: string): string {
    const template = fs.readFileSync(templatePath, "utf8");
    return template;
  }

  static renderFile(templatePath: string, context?: AnyObject): string {
    const template = Component.compileFile(templatePath, context);
    return this.renderString(template, context);
  }
}
