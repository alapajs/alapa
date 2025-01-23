import { AnyObject, StringObject } from "../../../interface/object";
import { IComponent, ParseResult } from "../../interface";
import {
  attributeRegex,
  htmlInlineTagsRegex,
  htmlTagsRegex,
  renderRegex,
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

  compileString(template: string, basePath?: string): [string, AnyObject] {
    const componentModules = new ComponentModules(basePath);
    this.modules = componentModules.getComponents(template, basePath);

    const components = this.parser(template);
    const code = this.preCompile(template, components);
    return [code, this.context];
  }

  compileFile(templatePath: string): [string, AnyObject] {
    const resolvedPath = PathResolver.resolve(templatePath);
    const template = TemplateEngine.getTemplate(resolvedPath);

    return this.compileString(template, resolvedPath);
  }

  private preCompile(template: string, components: ParseResult[]): string {
    const stack: ParseResult[] = [...components];
    let modifiedTemplate = template;

    while (stack.length > 0) {
      const component = stack.pop();
      const { name, attributes, content, input, attributeValue } = component!;
      const module = this.modules[name];

      if (module) {
        let compiled = this.compileComponent(
          module.content,
          attributes,
          content,
          attributeValue,
          module.propsName
        );
        compiled = compiled.replace(renderRegex, (match, key) => {
          key = `${key.trim()}`;
          let value = attributes[key];
          if (key === "content") {
            value = content;
          }
          if (
            htmlInlineTagsRegex.test(value) ||
            htmlInlineTagsRegex.test(value)
          ) {
            // Handle inline tags
            stack.push(...this.parser(value)); // If needed to handle deeper nesting
          }
          return value;
        });
        modifiedTemplate = modifiedTemplate.replace(input, compiled);

        // Add newly parsed components to stack if needed
        const parsedComponents = this.parser(compiled.trim());
        stack.push(...parsedComponents);
      } else {
        Logger.error(`Component '${name}' not found`);
      }
    }

    return modifiedTemplate;
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

    let compiled = this.engine(content, propsName, localContext);
    const parsedComponents = this.parser(compiled.trim());

    if (parsedComponents.length > 0) {
      // Using preCompile in the iterative way
      compiled = this.preCompile(compiled.trim(), parsedComponents);
    }

    return compiled;
  }

  private setDynamicParams(
    context: AnyObject,
    propsNameKey: string
  ): [string, AnyObject] {
    let code = "";
    const attributes = context.attributes;
    Object.keys(context).forEach((key) => {
      key = key.trim();
      if (key.startsWith(":")) {
        const newKey = key.substring(1);
        const keyName = attributes[key];
        code = `
         pre_${propsNameKey}['attributes']['${newKey}'] =  ${keyName};
         pre_${propsNameKey}['${newKey}'] =  ${keyName};
        `;
        delete attributes[key];
        delete context[key];
      }
      context.attributes = attributes;
    });
    if (code.length > 0) {
      code = `{%
      pre_${propsNameKey}['attributes']={}; 
      (()=>{${code}})(); %}`;
    }
    return [code, context];
  }
  private engine(
    component: string,
    propsName: string,
    localContext: AnyObject
  ): string {
    propsName = propsName || "props";
    const key = "props_" + md5(randomNumber() + randomNumber());
    const [paramsCode, context] = this.setDynamicParams(localContext, key);
    this.context[key] = context;
    this.context[`pre_${key}`] = {};
    const code = `<clear>
${paramsCode}
{% (function () { %}
{% var currentComponentID = '${key}';  %}
{% const ${propsName} = {...${key},...(${key}['attributes']),...pre_${key}}; %}
{% const content = ${propsName}['content']; %}
{% const stringAttribute = ${propsName}['stringAttribute']; %}
{% const attributes = ${propsName}['attributes']; %}
</clear>${component}
{% }()) %}`;
    return code;
  }
}
