import { Logger } from "../../utils";
import { TemplateEngine } from "../render";
import { PathResolver } from "../path-resolver";
import { codeRegex, includesRegex } from "../regex/misc";
import { removeCommentsFromCode } from "../utils";

export class Include {
  static render(template: string, processedTemplates = new Set()): string {
    template = removeCommentsFromCode(template);
    template = template.replace(codeRegex, (match) => {
      match = match.replace(includesRegex, (match, key, fileName) => {
        // Check for circular includes
        if (processedTemplates.has(fileName)) {
          throw new Error(`Circular include detected: ${fileName}`);
        }

        // Add the current fileName to the Set
        processedTemplates.add(fileName);
        let content = "";
        try {
          content = TemplateEngine.getTemplate(PathResolver.resolve(fileName));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          if (key === "require") {
            throw new Error(`Require Error ${e}`);
          }
          Logger.warn(`Include Error: ${e}`);
        }
        content = this.render(content, processedTemplates);

        // Remove the fileName from the Set after rendering
        processedTemplates.delete(fileName);

        const includes = `%} ${content} {%`;
        return includes;
      });
      return match;
    });
    return template;
  }
}
