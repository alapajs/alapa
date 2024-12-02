/* eslint-disable @typescript-eslint/no-explicit-any */
import { md5, randomNumber, Logger } from "../../../utils";
import { List } from "../../../interface";
import { AnyObject, StringObject } from "../../../interface/object";
import { ImportedModules, Modules, ParseResult } from "../../interface";
import {
  attributeRegex,
  htmlInlineTagsRegex,
  htmlTagsRegex,
  moduleRegex,
} from "../../regex/misc";
import { ImportParser } from "../../imports";
import { TemplateEngine } from "../../engine";
import { PathResolver } from "../../path-resolver";

export class Component {
  static modules: Modules = {};
  static components: ParseResult[] = [];
  private static context: AnyObject = {};
  private static template: string = "";
  private static templatePath: string = "";

  static loadModule(module: ImportedModules) {
    const {
      filePath,
      defaultModule,
      components,
      componentsAlias,
      defaultAlias,
    } = module;
    const moduleContents = TemplateEngine.getTemplate(filePath);
    this.validateModuleContents(moduleContents, filePath);
    if (defaultModule != "" && defaultModule != "*") {
      this.parseModules(moduleContents, "default", defaultAlias, defaultModule);
    }
    if (components.length > 0) {
      const regex = moduleRegex(false, ...components);
      this.parseModules(moduleContents, regex, componentsAlias, components);
    } else if (defaultModule == "*") {
      this.parseModules(moduleContents, "all", defaultAlias);
    }
    if (defaultModule.length == 0 && components.length == 0) {
      this.parseModules(moduleContents, "all");
    }
  }

  static validateModuleContents(contents: string, filePath: string) {
    const defaultComponents = Array.from(contents.matchAll(moduleRegex(true)));
    if (defaultComponents.length > 1) {
      Logger.error(
        `${defaultComponents.length} components are defined in ${filePath}`
      );
      return;
    }
  }

  static handleDefaultModule(
    defaultModule: string,
    alias: string,
    moduleContents: string
  ) {
    if (defaultModule === "*" || defaultModule === "") {
      this.parseModules(moduleContents, "all", alias);
    } else if (defaultModule) {
      this.parseModules(moduleContents, "default", undefined, defaultModule);
    }
  }

  static parseModules(
    contents: string,
    regex: RegExp | "all" | "default" = "all",
    alias?: StringObject | string,
    components?: string[] | string
  ) {
    if (typeof components === "string") components = [components];

    const componentList = new List<string>(...(components || []));
    const [isDefault, allAlias] = this.initializeFlags(regex, alias);
    regex = this.determineRegex(regex, components);
    const definedModulesSearch = contents.matchAll(regex);
    this.processDefinedModules(
      definedModulesSearch,
      componentList,
      isDefault,
      allAlias
    );
  }

  static initializeFlags(
    regex: RegExp | "all" | "default",
    alias?: StringObject | string
  ): [boolean, string] {
    const isDefault = regex === "default";
    const allAlias = typeof alias === "string" && regex === "all" ? alias : "";
    return [isDefault, allAlias];
  }

  static determineRegex(
    regex: RegExp | "all" | "default",
    components?: string[]
  ) {
    if (!components) components = [];
    if (regex === "all" || regex === undefined) return moduleRegex("all");
    if (regex === "default") return moduleRegex(true, ...components);
    return regex;
  }

  static processDefinedModules(
    definedModulesSearch: IterableIterator<RegExpMatchArray>,
    componentList: List<string>,
    isDefault: boolean,
    allAlias: string
  ) {
    let foundLength = 0;

    for (const match of definedModulesSearch) {
      foundLength++;
      const { name, propsName, content } = this.extractModuleDetails(match);
      componentList.remove(name);
      const alias = this.getAlias(name, allAlias);

      this.modules[name] = { propsName, name, alias, content };
    }

    this.logErrors(foundLength, componentList, isDefault);
  }

  static extractModuleDetails(match: RegExpMatchArray) {
    let name = match[1] || "";
    let propsName = match[2] || "props";
    let content = match[3] || "";
    if (match[4] && match[2]) {
      name = match[2] || "";
      propsName = match[3] || "props";
      content = match[4] || "";
    }

    return {
      name,
      propsName,
      content,
    };
  }

  static getAlias(name: string, allAlias: string): string {
    return allAlias.length > 0 ? `${allAlias}.${name}` : name;
  }

  static logErrors(
    foundLength: number,
    componentList: List<string>,
    isDefault: boolean
  ) {
    if (foundLength === 0) {
      const errorMessage = isDefault
        ? `No default component found${
            componentList.length > 0 ? `: ${componentList.join()}` : ""
          }`
        : `No components found in: ${componentList.join()}`;
      Logger.error(errorMessage);
    } else if (componentList.length > 0) {
      Logger.error(
        `${componentList.join(", ")} ${
          componentList.length > 1 ? "components are" : "component is"
        } not found`
      );
    }
  }

  static parseComponent(template: string) {
    template = template.replace(moduleRegex(), "");
    this.components.push(...this.parser(template));
  }

  static parser(template: string, getAttribute: boolean = true): ParseResult[] {
    const htmlTags = Array.from(template.matchAll(htmlTagsRegex)).map(
      (match) => ({
        name: match[1],
        attributes: getAttribute ? this.parseAtrAttributes(match[2] || "") : {},
        input: match[0],
        content: match[3] ?? "",
        attributeValue: match[2] ?? "",
      })
    );
    const htmlInlineTags = Array.from(
      template.matchAll(htmlInlineTagsRegex)
    ).map((match) => ({
      name: match[1],
      attributes: getAttribute ? this.parseAtrAttributes(match[2] || "") : {},
      input: match[0],
      content: "",
      attributeValue: match[2] ?? "",
    }));
    return htmlTags.concat(htmlInlineTags);
  }

  static parseAtrAttributes(template: string): StringObject {
    const attributes: StringObject = {};
    const matches = template.matchAll(attributeRegex);
    for (const match of matches) {
      attributes[match[1]] = match[4] ?? match[1];
    }
    return attributes;
  }

  static bundle(template: string) {
    this.parseComponent(template);
    let moduleFiles: ImportedModules[] = [];
    try {
      moduleFiles = ImportParser.getFiles(this.templatePath);
    } catch (e: any) {
      throw new Error(`${e.message} in ${this.templatePath}`);
    }
    this.loadModules(moduleFiles);
  }

  static compileString(template: string, context?: AnyObject): string {
    this.context = context || {};
    this.bundle(template);
    return this.preCompile(template, this.components);
  }

  static preCompile(template: string, components: ParseResult[]): string {
    for (const component of components) {
      const { attributes, content, name, input, attributeValue } = component;
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
        Logger.error(`Module '${name}' not found`);
      }
    }
    return template;
  }

  static compileComponent(
    content: string,
    attributes: StringObject,
    componentContent: string,
    attributeValue: string,
    propsName: string
  ) {
    const context: AnyObject = {
      ...attributes,
      stringAttribute: attributeValue,
      content: componentContent,
    };
    context["attributes"] = attributes;

    let compiled = this.engine(content, propsName, context);
    const templateParse = this.parser(compiled.trim());
    if (templateParse.length > 0) {
      compiled = this.preCompile(compiled.trim(), templateParse);
    }
    return compiled;
  }

  static compileFile(templatePath: string, context?: AnyObject): string {
    templatePath = PathResolver.resolve(templatePath);
    const template = TemplateEngine.getTemplate(templatePath);
    this.template = template;
    this.templatePath = templatePath;
    return this.compileString(template, context);
  }

  static engine(
    component: string,
    propsName: string,
    context?: AnyObject
  ): string {
    context = context || {};

    const key = md5(randomNumber());
    (global as any)["component" + key] = context;
    const code = `{% (function () { %}
{% const ${propsName}  = {...component${key},...(component${key}['attributes'])} %}
{% delete global["component${key}"]; %}
{% const content = ${propsName}['content'] %}
{% const stringAttribute  =${propsName}['stringAttribute'] %}
{% const attributes = ${propsName}['attributes'] %}
${component}
{% }()) %}`;
    return TemplateEngine.compile(code, this.context);
  }

  static loadModules(modules: ImportedModules[]) {
    for (const module of modules) {
      this.loadModule(module);
    }
  }
}
