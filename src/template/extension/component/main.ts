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

  convertInlineTags(template: string): string {
    template = template.replace(
      htmlInlineTagsRegex,
      (match, name, attribute) => {
        return `<X:${name} ${attribute}></X:${name}>`;
      }
    );
    return template;
  }
  parser(template: string, getAttributes = true): ParseResult[] {
    template = this.convertInlineTags(template);
    const htmlTags = Array.from(template.matchAll(htmlTagsRegex)).map(
      (match) => ({
        name: match[1],
        attributes: getAttributes ? this.parseAttributes(match[2] || "") : {},
        input: match[0],
        content: match[3] ?? "",
        attributeValue: match[2] ?? "",
      })
    );
    return htmlTags;
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
    template = this.convertInlineTags(template);
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
    template = this.convertInlineTags(template);
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
          value = this.convertInlineTags(value);
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

  private spreadAttribute(
    context: AnyObject,
    propsNameKey: string
  ): [string, AnyObject] {
    let code = "";
    Object.keys(context).forEach((key) => {
      key = key.trim();
      if (key.startsWith("...")) {
        const newKey = key.substring(3);
        code += `
        Object.keys(spread_attributes_${propsNameKey}).forEach((key) => {
        if (key.startsWith(":") || key.startsWith("@")) {
            const newKey = key.substring(1);
            const keyValue = eval(spread_attributes_${propsNameKey}[key]);
            delete spread_attributes_${propsNameKey}[key];
            delete spread_${propsNameKey}[key];
            spread_attributes_${propsNameKey}[newKey] = keyValue;
            spread_${propsNameKey}[newKey] = keyValue;
        }
        });
        if(typeof ${newKey} !== "object"){
           throw new Error("The value of the spread attribute must be an object. Please ensure that the attribute ${newKey} is an object.");
        }
         spread_attributes_${propsNameKey} = {...spread_attributes_${propsNameKey},...${newKey}};
         spread_${propsNameKey} = {...spread_${propsNameKey},...${newKey}};
         `;

        delete context[key];
      }
    });
    if (code.length > 0) {
      code = `{% (()=>{${code}})(); %}`;
    }
    return [code, context];
  }

  private setDynamicParams(
    context: AnyObject,
    propsNameKey: string
  ): [string, AnyObject] {
    let code = "";
    const attributes = context.attributes || {};
    Object.keys(context).forEach((key) => {
      key = key.trim();
      if (key.startsWith(":") || key.startsWith("@")) {
        const newKey = key.substring(1);

        const keyValue = attributes[key];
        code += `
         pre_attributes_${propsNameKey}['${newKey}'] =  ${keyValue};
         pre_${propsNameKey}['${newKey}'] =  ${keyValue};
        `;
        delete attributes[key];
        delete context[key];
      }
    });
    if (code.length > 0) {
      code = `{% (()=>{${code}})(); %}`;
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
    const [spreadCode, spreadContext] = this.spreadAttribute(localContext, key);
    const [paramsCode, context] = this.setDynamicParams(spreadContext, key);
    this.context[key] = context;
    this.context[`pre_${key}`] = {};
    this.context[`pre_attributes_${key}`] = {};
    this.context[`spread_attributes_${key}`] = {};
    this.context[`spread_${key}`] = {};

    const code = `<clear>
${spreadCode}
${paramsCode}
{% (function () { %}
{% const ${propsName} = {...spread_${key},...${key},...pre_${key}} %}
{% ${propsName}['attributes']  =  {...spread_attributes_${key},...(${propsName}['attributes']),...pre_attributes_${key}}; %}
{% ${propsName}['stringAttribute'] = objectToHtmlAttributes(${propsName}['attributes']) %}
{% const content = ${propsName}['content']; %}
{% const stringAttribute = ${propsName}['stringAttribute']; %}
{% const attributes = ${propsName}['attributes']; %}
</clear>${component}
{% }()) %}`;
    return code;
  }
}
