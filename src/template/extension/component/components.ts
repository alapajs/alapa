import { List, StringObject } from "../../../interface";
import { Logger } from "../../../utils";
import { ImportParser } from "../../imports";
import { IComponent, ImportedModules } from "../../interface";
import { moduleRegex } from "../../regex/misc";
import { TemplateEngine } from "../../render";

export class ComponentModules {
  private components: IComponent = {};
  private templatePath: string;
  private template: string;
  constructor(basePath?: string) {
    this.updateBasePath(basePath);
  }
  private updateBasePath(basePath?: string) {
    if (basePath) {
      this.templatePath = basePath;
    }
  }
  private getModuleFiles() {
    return ImportParser.getFiles(this.templatePath);
  }
  getComponents(template: string, basePath?: string): IComponent {
    this.updateBasePath(basePath);
    this.template = template;
    const moduleFiles: ImportedModules[] = this.getModuleFiles();
    this.loadModules(moduleFiles);
    return this.components;
  }
  private loadModule(module: ImportedModules) {
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

  private validateModuleContents(contents: string, filePath: string) {
    const defaultComponents = Array.from(contents.matchAll(moduleRegex(true)));
    if (defaultComponents.length > 1) {
      Logger.error(
        `${defaultComponents.length} components are defined in ${filePath}`
      );
      return;
    }
  }

  private handleDefaultModule(
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

  private parseModules(
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

  private initializeFlags(
    regex: RegExp | "all" | "default",
    alias?: StringObject | string
  ): [boolean, string] {
    const isDefault = regex === "default";
    const allAlias = typeof alias === "string" && regex === "all" ? alias : "";
    return [isDefault, allAlias];
  }

  private determineRegex(
    regex: RegExp | "all" | "default",
    components?: string[]
  ) {
    if (!components) components = [];
    if (regex === "all" || regex === undefined) return moduleRegex("all");
    if (regex === "default") return moduleRegex(true, ...components);
    return regex;
  }

  private processDefinedModules(
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

      this.components[name] = { propsName, name, alias, content };
    }

    this.logErrors(foundLength, componentList, isDefault);
  }

  private extractModuleDetails(match: RegExpMatchArray) {
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

  private loadModules(modules: ImportedModules[]) {
    for (const module of modules) {
      this.loadModule(module);
    }
  }

  private getAlias(name: string, allAlias: string): string {
    return allAlias.length > 0 ? `${allAlias}.${name}` : name;
  }

  private logErrors(
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
}
