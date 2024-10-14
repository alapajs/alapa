import { StringObject } from "../interface/object";

export interface Modules {
  [key: string]: {
    name: string;
    alias: string;
    propsName: string;
    content: string;
  };
}

export interface ParseResult {
  name: string;
  attributes: StringObject;
  attributeValue: string;
  content: string;
  file?: string;
  input: string;
}

export interface ImportedModules {
  filePath: string;
  components: string[];
  defaultModule: string;
  defaultAlias: string;
  componentsAlias: StringObject;
}
