import { TemplateEngine } from "../../render";
import { PathResolver } from "../../path-resolver";
import { containerRegex, stackRegex } from "../../regex/misc";
export interface ContainerParseResult {
  key: string;
  content: string;
}

export class Container {
  private static parser(template: string): ContainerParseResult[] {
    const result: ContainerParseResult[] = [];
    template.replaceAll(containerRegex, (match, group1, group2) => {
      result.push({
        key: (group1 || "").replace(/\s+/g, ""),
        content: group2 ?? "",
      });
      return "";
    });
    return result;
  }

  private static compile(
    template: string,
    containers: ContainerParseResult[]
  ): string {
    template = template.replace(stackRegex, (match, key) => {
      if (!key) {
        throw new Error("key not found in template" + match);
      }
      key = key.trim();
      containers = containers.filter((c) => c.key === key);
      console.log(containers);
      if (containers.length === 0) {
        return "";
      }
      let contents = "";
      for (const container of containers) {
        contents = `${contents}${container.content}`;
      }
      return contents;
    });
    return template;
  }

  static render(template: string): string {
    const containers = this.parser(template);
    template = Container.removeContainersFromTemplate(template);
    template = this.compile(template, containers);
    return template;
  }

  static renderFile(templatePath: string): string {
    templatePath = PathResolver.resolve(templatePath);
    const template = TemplateEngine.getTemplate(templatePath);
    return this.render(template);
  }
  private static removeContainersFromTemplate(template: string): string {
    return template.replaceAll(containerRegex, "");
  }
}
