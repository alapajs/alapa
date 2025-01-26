export interface ViewConfiguration {
  dir: string;
  extensions?: string | string[];
  staticFilesPath?: string;
  plugins?: string[];
  templateEngine?: {
    formatOutput?: boolean;
  };
}
