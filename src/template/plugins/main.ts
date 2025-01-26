/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject } from "../../interface";
import { defaultPlugs } from "./defaults";
import { generatePluginFromModule } from "./generate";
import { ActionPlugin, ITemplatePlugin } from "./interface";

export class TemplatePlugin {
  private static plugins: AnyObject = {};
  private static rawPlugins: ITemplatePlugin[] = [];
  static getRawsPlugins(): ITemplatePlugin[] {
    if (this.rawPlugins.length > 0) {
      return this.rawPlugins;
    }
    const rawPlugins = [...defaultPlugs];
    this.rawPlugins = rawPlugins;
    return this.rawPlugins;
  }

  static async filterPlugins(): Promise<ActionPlugin[]> {
    const plugins: ActionPlugin[] = [];
    const rawPlugins: ITemplatePlugin[] = this.getRawsPlugins();

    for (const rawPlug of rawPlugins) {
      if (typeof (rawPlug as any).modulePath == "string") {
        const generatedActionPlugin = await generatePluginFromModule(
          rawPlug as any
        );
        plugins.push(...generatedActionPlugin);
      } else {
        plugins.push(rawPlug as ActionPlugin);
      }
    }
    return plugins;
  }

  static getPlugins(): AnyObject {
    return this.plugins;
  }

  static async buildPlugins(): Promise<void> {
    this.getRawsPlugins();
    const filterPlugins = await this.filterPlugins();
    const plugins: AnyObject = {};
    for (const plug of filterPlugins) {
      plugins[plug.key] = plug.action;
    }
    this.plugins = plugins;
  }
}
