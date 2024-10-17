import { StringObject } from "../interface/object";
import { ImportedModules } from "./interface";
import { codeRegex, commentsRegex, importRegex } from "./regex/misc";
import { TemplateEngine } from "./engine";
import { PathResolver } from "./path-resolver";

export class ImportParser {
  static processedFiles: Set<string> = new Set();

  static getFiles(templatePath: string): ImportedModules[] {
    let modules: ImportedModules[] = [];
    templatePath = PathResolver.resolve(templatePath);
    let template = "";
    try {
      template = TemplateEngine.getTemplate(templatePath);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      throw new Error(e.message);
    }
    const codeBlocks = template.matchAll(codeRegex);

    for (const content of codeBlocks) {
      let code = content[1].trim();
      code = code.replace(commentsRegex, "");
      const importsMatch = code.matchAll(importRegex);

      for (const match of importsMatch) {
        const fileName = (match[2] || match[3] || "").trim();
        const components: string[] = [];
        let defaultModule = "";
        let namedModule = "";
        let defaultAlias: string = "";
        const componentsAlias: StringObject = {};
        const importValues = (match[1] || "")
          .trim()
          .replace(/\s+/g, " ")
          .replace("\n", "");

        if (importValues.includes("}")) {
          const parseValue = importValues.match(/(.+)?({.+})/);
          if (parseValue) {
            defaultModule = (parseValue[1] || "").trim().replace(/,$/, "");
            namedModule = (parseValue[2] || "").trim().replace(/[{}]/g, "");
          }
        } else {
          defaultModule = importValues;
        }

        if (defaultModule != "") {
          if (defaultAlias.split(",").length > 1) {
            throw new Error(
              `Two default module ${defaultModule} import in statement`
            );
          }
          const parts = this.parseName(defaultModule);
          defaultModule = parts.name;
          if (parts.alias.length > 0) {
            defaultAlias = parts.alias;
          }
        }

        for (const value of namedModule.split(",")) {
          if (value == "") continue;
          const parts = this.parseName(value);
          components.push(parts.name);
          if (parts.alias.length > 0) {
            componentsAlias[parts.name] = parts.alias;
          }
        }
        const filePath = PathResolver.resolve(fileName, {
          currentPath: templatePath,
        });

        // Check if the file is already being processed to prevent circular imports
        if (this.processedFiles.has(filePath)) {
          continue; // Skip processing this file
        }

        // Add the file to the set of processed files
        this.processedFiles.add(filePath);

        modules.push({
          filePath,
          components,
          defaultModule,
          componentsAlias,
          defaultAlias,
        });

        // Recursively get files from the imported module
        let children: ImportedModules[] = [];
        try {
          children = this.getFiles(filePath);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          throw new Error(e + " In " + templatePath);
        }
        modules = modules.concat(children);

        // Remove the file from the processed set after processing
        this.processedFiles.delete(filePath);
      }
    }
    return modules;
  }

  static parseName(module: string) {
    let name = module.trim();
    let alias = "";
    if (module.includes(" as ")) {
      const parts = module.split(" as ");
      name = parts[0].trim();
      alias = parts[1].trim();
    }
    return { alias, name };
  }
}
