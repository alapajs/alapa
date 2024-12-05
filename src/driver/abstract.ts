export interface IStorageDriverError {
  errorCode: number; // A unique code identifying the error
  errorMessage: string; // A description or message about the error
  timestamp: Date; // The timestamp when the error occurred
  severity: "low" | "medium" | "high"; // Severity level of the error
  filePath?: string; // Optional file path where the error occurred
  suggestedAction?: string; // Optional suggested action to resolve the error
}

export abstract class StorageDriver {
  abstract name: string;
  abstract absolutePath: string;
  abstract absoluteURL: string;
  abstract error: IStorageDriverError | null;
  abstract saveFile(filePath: string, key: string): Promise<string | boolean>;
}
