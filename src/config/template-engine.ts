export interface TemplateEngineConfiguration {
  /** Directory for template files */
  viewDir: string;
  /** File extensions for template files */
  fileExtensions?: string | string[];
  /** Path to static files */
  staticFilesPath?: string;
  /** Plugins for template engine */
  plugins?: string[];
  /** Format output on development */
  formatOutPutOnDev?: boolean;
  /** Minify output on production */
  minifyOutputOnProd?: boolean;
}
