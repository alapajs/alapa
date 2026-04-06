/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Represents a plugin for the template engine.
 */
export interface BasePlugin {
  /**
   * The version of the plugin.
   * This field is optional and can be used for version management of plugins.
   */
  version?: string;

  /**
   * A brief description of the plugin.
   * This is optional and provides additional information about the plugin's purpose and functionality.
   */
  description?: string;

  /**
   * The author of the plugin.
   * This field is optional and can be used to track the creator of the plugin.
   */
  author?: string;

  /**
   * A priority value indicating the order in which plugins should be executed.
   * Lower priority values will execute first. This field is optional.
   */
  priority?: number;
}

export interface ActionPlugin extends BasePlugin {
  /**
   * The action associated with the plugin.
   * This can be any function or class that defines the behavior of the plugin.
   */
  action: any; // Action can be any function or class.

  /**
   * A unique identifier for the plugin.
   * This key will be used to refer to and manage the plugin within the system.
   */
  key: string;
}

export interface ModulePlugin extends BasePlugin {
  key?: string;
}

export interface ModulePluginOption extends BasePlugin {
  defaultName?: string;
  config?: Record<string, ModulePlugin>;
  modulePath: string;
}

/**
 * Configuration for managing plugins in the template engine.
 */
export interface TemplatePluginsConfiguration {
  /**
   * List of plugins to be loaded and used in the template engine.
   * These plugins will be applied to the engine in the order specified.
   */
  plugins: ITemplatePlugin[];

  /**
   * A list of plugin keys to be removed from the system.
   * This can be a single key or an array of keys.
   */
  remove?: string | string[];

  /**
   * A list of plugins that should replace the old ones in the system.
   * These plugins will be substituted for the plugins specified in `remove`.
   */
  replacements?: ITemplatePlugin[];
}

export type ITemplatePlugin = ActionPlugin | ModulePluginOption;
