import { AnyObject } from "../interface/object";
import { Logger, objectToHtmlAttributes } from "../utils";
import { Component } from "./extension/component/main";
import { Container } from "./extension/container/main";
import { Include } from "./extension/include";
import { outPutVariable } from "./output";
import { Buffer } from "node:buffer";
import minifyHtml from "@minify-html/node";
import { html } from "js-beautify";
import {
  clearRegex,
  codeRegex,
  importRegex,
  noCodeRegex,
  templateCommentRegex,
} from "./regex/misc";
import { escapeCode, escapeHTML, removeCommentsFromCode } from "./utils";
import fs from "fs";
import { EVN } from "../shared";
import { GlobalConfig } from "../shared/globals";
import { TemplatePlugin } from "./plugins/main";
export class TemplateEngine {
  static compile(template: string, context?: AnyObject) {
    template = template.replace(templateCommentRegex, "");
    template = removeCommentsFromCode(template);
    template = Include.render(template);
    let outputOfTemplateEngine = "";
    function addOutPutToTemplateEngine(output: string = "") {
      outputOfTemplateEngine += output;
    }
    const getOutPutToTemplateEngine = () => outputOfTemplateEngine;
    context = context || {};
    context["addOutPutToTemplateEngine"] = addOutPutToTemplateEngine;
    context["objectToHtmlAttributes"] = objectToHtmlAttributes;
    // context["echo"] = addOutPutToTemplateEngine;
    context["getOutPutToTemplateEngine"] = getOutPutToTemplateEngine;
    context["escapeHTML"] = escapeHTML;
    context["locals"] = {};
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
      return `; addOutPutToTemplateEngine(\`${html}\`); `;
    });

    const plugins = TemplatePlugin.getPlugins();
    context = { ...plugins, ...context };

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
    return output !== undefined ? output.trim() : "";
  }

  static renderString(template: string, context?: object): string {
    template = this.compile(template, context) || "";
    template = Container.render(template);
    return this.format(template);
  }

  static getTemplate(templatePath: string): string {
    const template = fs.readFileSync(templatePath, "utf8");
    return template;
  }

  static format(template: string): string {
    template = template.replace(clearRegex, "");
    if (GlobalConfig.view.templateEngine?.formatOutput === false) {
      return template;
    }

    if (EVN == "production") {
      template = minifyHtml.minify(Buffer.from(template), {}).toString();
    }
    if (EVN == "development") {
      template = html(template, {
        indent_size: 2, // Use 2 spaces for indentation
        indent_char: " ", // Use spaces for indentation
        max_preserve_newlines: 0, // Allow at most 1 line break between tags
        preserve_newlines: true, // Keep new lines where appropriate
        wrap_line_length: 0, // Do not wrap lines by default
        indent_inner_html: true, // Indent inner HTML elements
        // space_after_anon_function: true, // Add space after anonymous functions
        end_with_newline: true, // Ensure the output ends with a newline
        unformatted: ["pre", "code"], // Keep 'pre' and 'code' tags unformatted (optional)
        // Add other properties based on your needs
      });
    }
    return template;
  }

  static renderFile(templatePath: string, context?: AnyObject): string {
    const component = new Component();
    const [template, componentsContext] = component.compileFile(templatePath);
    return this.renderString(template, { ...context, ...componentsContext });
  }
}
