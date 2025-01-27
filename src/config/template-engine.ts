export interface TemplateEngineConfiguration {
  viewDir: string;
  fileExtensions?: string | string[];
  staticFilesPath?: string;
  plugins?: string[];
  formatOutPutOnDev?: boolean;
  minifyOutputOnProd?: boolean;
}
