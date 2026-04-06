/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClassName, isClass, isSet, Logger } from "../../utils";
import fs from "fs";
import { ModulePlugin, ModulePluginOption, ActionPlugin } from "./interface";

export const generatePluginFromModule = async (
  option: ModulePluginOption
): Promise<ActionPlugin[]> => {
  if (!option) {
    throw new Error("Option must is required");
  }
  const filePath: string = option.modulePath;
  if (!fs.existsSync(filePath)) {
    throw new Error(`Module file not found at ${filePath}`);
  }
  const plugins: ActionPlugin[] = [];
  let importModule: any;
  try {
    importModule = await import(filePath);
  } catch (error) {
    Logger.error("Error importing module:", error);
  }
  if (!importModule) return [];

  if (typeof importModule !== "object") {
    throw new Error(`Invalid module at ${filePath}`);
  }
  const defaultPlugin = getDefaultModulePlugin(importModule, option);
  if (defaultPlugin) {
    plugins.push(defaultPlugin);
  }

  const pluginKeys = Object.keys(importModule);
  const configurations = option.config;
  pluginKeys.forEach((key) => {
    let config: ModulePlugin = {};
    if (configurations) {
      config = configurations[key] || {};
    }
    const plugin = {
      key,
      action: importModule[key],
      ...config,
    };
    plugins.push(plugin);
  });

  return plugins;
};

const getDefaultModulePlugin = (
  importModule: any,
  option?: ModulePluginOption
): ActionPlugin | null => {
  const defaultModule = importModule.default;
  if (!isSet(defaultModule)) return null;
  const defaultAlias: string =
    option?.defaultName || importModule.alias || getDefaultName(defaultModule);
  if (isSet(defaultAlias)) {
    return {
      version: importModule.version,
      description: importModule.description,
      author: importModule.author,
      priority: importModule.priority,
      action: defaultModule,
      key: defaultAlias,
    };
  }
  return null;
};

const getDefaultName = (defaultModule: any): string | null => {
  if (!isSet(defaultModule)) return null;

  if (isClass(defaultModule)) {
    return getClassName(defaultModule);
  }
  if (typeof defaultModule === "function") {
    return defaultModule.name;
  }
  if (Array.isArray(defaultModule)) {
    return getDefaultName(defaultModule[0]);
  }
  return null;
};
