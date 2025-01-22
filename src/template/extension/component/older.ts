/* eslint-disable prefer-const */
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

  private preCompile(
    template: string,
    components: ParseResult[],
    processedComponents = new Set<string>()
  ): string {
    for (const component of components) {
      let { name, attributes, content, input, attributeValue } = component;

      // Prevent processing if content has already been processed
      if (processedComponents.has(input)) {
        continue;
      }

      const module = this.modules[name];
      if (module) {
        const compiled = this.compileComponent(
          module.content,
          attributes,
          content,
          attributeValue,
          module.propsName
        );

        // Mark content as processed
        processedComponents.add(input);

        if (this.parseComponent(content).length > 0) {
          content = this.preCompile(
            content,
            this.parser(content),
            processedComponents
          );
        }

        console.log(content); // Check for content in logs for debugging

        // Replace the content in the template with compiled result
        template = template.replace(input, compiled);
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
    let compiled = this.engine(content, propsName, localContext);
    const parsedComponents = this.parser(compiled.trim());

    if (parsedComponents.length > 0) {
      compiled = this.preCompile(compiled.trim(), parsedComponents);
    }

    return compiled;
  }

  private engine(
    component: string,
    propsName: string,
    localContext: AnyObject
  ): string {
    const key = md5(randomNumber());
    (global as any)[`component${key}`] = localContext;

    const code = `{% (function () { %}
{% const ${propsName} = { ...component${key}, ...(component${key}['attributes']) }; %}
{% const content = ${propsName}['content']; %}
{% const stringAttribute = ${propsName}['stringAttribute']; %}
{% const attributes = ${propsName}['attributes']; %}
${component}
{% }()) %}`;
    return code;
    return TemplateEngine.compile(code, this.context);
  }
}
