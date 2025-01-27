import { EVN } from "../shared";
import { GlobalConfig } from "../shared/globals";
import { Buffer } from "node:buffer";
import minifyHtml from "@minify-html/node";
import { html } from "js-beautify";
import { clearRegex } from "./regex/misc";

export const formatHtmlOutput = (template: string): string => {
  const templateEngineConfig = GlobalConfig.templateEngine;
  template = template.replace(clearRegex, "");

  if (EVN == "production" && templateEngineConfig.minifyOutputOnProd === true) {
    template = minifyHtml.minify(Buffer.from(template), {}).toString();
  }
  if (EVN == "development" && templateEngineConfig.formatOutPutOnDev === true) {
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
  return template.trim();
};
