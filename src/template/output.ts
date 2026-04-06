import { outputRegex } from "./regex/misc";

export function outPutVariable(template: string) {
  return template.replace(outputRegex, (match, open, key, close) => {
    if (open.length == close.length) {
      if (open.length === 2 || open.length === 3) {
        let value = `{% addOutPutToTemplateEngine(\`$\{${key}}\`); %}`;
        if (open.length === 2) {
          value = `{% addOutPutToTemplateEngine(escapeHTML(\`$\{${key}}\`)); %}`;
        }
        return value;
      }
    }
    return match;
  });
}
