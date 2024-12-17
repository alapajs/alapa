import { TemplateEngine } from "../../render";
import { PathResolver } from "../../path-resolver";
import { containerRegex } from "../../regex/misc";
export interface ContainerParseResult {
  key: string;
  content: string;
}

export class Container {
  private static containers: ContainerParseResult[] = [];
  private static parser(template: string) {
    const result: ContainerParseResult[] = [];
    template.replaceAll(containerRegex, (match, group1, group2) => {
      result.push({
        key: (group1 || "").replace(/\s+/g, ""),
        content: group2 ?? "",
      });
      return "";
    });
    this.containers = [...result, ...this.containers];
  }
  static compile(template: string): ContainerParseResult[] {
    this.parser(template);
    return this.containers;
  }
  static compileFile(templatePath: string): ContainerParseResult[] {
    templatePath = PathResolver.resolve(templatePath);
    const template = TemplateEngine.getTemplate(templatePath);
    return this.compile(template);
  }
  static removeContainersFromTemplate(template: string): string {
    return template.replaceAll(containerRegex, "");
  }

  static clear() {
    this.containers = [];
  }
  static get(): ContainerParseResult[] {
    return this.containers;
  }
}
