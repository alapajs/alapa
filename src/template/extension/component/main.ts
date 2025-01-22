/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject, StringObject } from "../../../interface/object";
import { IComponent, ParseResult } from "../../interface";
import {
  attributeRegex,
  htmlInlineTagsRegex,
  htmlTagsRegex,
} from "../../regex/misc";
import { TemplateEngine } from "../../render";
import { PathResolver } from "../../path-resolver";
import { Logger, md5, randomNumber } from "../../../utils";
import { ComponentModules } from "./components";

export class Component {
  private modules: IComponent = {};
  private context: AnyObject = {};

  parseComponent(template: string): ParseResult[] {
    return this.parser(template);
  }

  parser(template: string, getAttributes = true): ParseResult[] {
    const htmlTags = Array.from(template.matchAll(htmlTagsRegex)).map(
      (match) => ({
        name: match[1],
        attributes: getAttributes ? this.parseAttributes(match[2] || "") : {},
        input: match[0],
        content: match[3] ?? "",
        attributeValue: match[2] ?? "",
      })
    );

    const htmlInlineTags = Array.from(
      template.matchAll(htmlInlineTagsRegex)
    ).map((match) => ({
      name: match[1],
      attributes: getAttributes ? this.parseAttributes(match[2] || "") : {},
      input: match[0],
      content: "",
      attributeValue: match[2] ?? "",
    }));

    return [...htmlTags, ...htmlInlineTags];
  }

  parseAttributes(template: string): StringObject {
    const attributes: StringObject = {};
    const matches = template.matchAll(attributeRegex);
    for (const match of matches) {
      attributes[match[1]] = match[4] ?? match[1];
    }
    return attributes;
  }

  compileString(
    template: string,
    context?: AnyObject,
    basePath?: string
  ): string {
    const componentModules = new ComponentModules(basePath);
    this.modules = componentModules.getComponents(template, basePath);
    this.context = context || {};

    const components = this.parser(template);
    return this.preCompile(template, components);
  }

  compileFile(templatePath: string, context?: AnyObject): string {
    const resolvedPath = PathResolver.resolve(templatePath);
    const template = TemplateEngine.getTemplate(resolvedPath);

    return this.compileString(template, context, resolvedPath);
  }

  private preCompile(template: string, components: ParseResult[]): string {
    for (const component of components) {
      const { name, attributes, content, input, attributeValue } = component;
      const module = this.modules[name];

      if (module) {
        const compiled = this.compileComponent(
          module.content,
          attributes,
          content,
          attributeValue,
          module.propsName
        );
        template = template.replace(input, compiled.trim());
      } else {
        Logger.error(`Component '${name}' not found`);
      }
    }
    return template;
  }

  private compileComponent(
    content: string,
    attributes: StringObject,
    componentContent: string,
    attributeValue: string,
    propsName: string
  ): string {
    const localContext: AnyObject = {
      ...attributes,
      stringAttribute: attributeValue,
      content: componentContent,
    };
    localContext["attributes"] = attributes;

    // Merge local context into global context
    const componentContext = { ...this.context, ...localContext };

    let compiled = this.engine(content, propsName, componentContext);
    const parsedComponents = this.parser(compiled.trim());

    if (parsedComponents.length > 0) {
      compiled = this.preCompile(compiled.trim(), parsedComponents);
    }

    return compiled;
  }

  private engine(
    component: string,
    propsName: string,
    context: AnyObject
  ): string {
    const key = md5(randomNumber());
    (global as any)[`component${key}`] = context;

    const code = `{% (function () { %}
{% const ${propsName} = { ...component${key}, ...(component${key}['attributes']) }; %}
{% delete global["component${key}"]; %}
{% const content = ${propsName}['content']; %}
{% const stringAttribute = ${propsName}['stringAttribute']; %}
{% const attributes = ${propsName}['attributes']; %}
${component}
{% }()) %}`;
    return TemplateEngine.compile(code, this.context);
  }
}
