export interface ViewConfiguration {
  dir: string;
  staticFilesPath?: string;
  extensions?: string | string[];
  templateEngine?: {
    formatOutput?: boolean;
  };
}
