export interface IStorageDriverError {
  errorCode: number; // A unique code identifying the error
  errorMessage: string; // A description or message about the error
  timestamp: Date; // The timestamp when the error occurred
  severity: "low" | "medium" | "high"; // Severity level of the error
  filePath?: string; // Optional file path where the error occurred
  suggestedAction?: string; // Optional suggested action to resolve the error
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FileData = any;

export abstract class StorageDriver {
  abstract name: string;
  abstract absolutePath: string;
  abstract absoluteURL: string;
  abstract error: IStorageDriverError | null;
  abstract saveFilePath(
    filePath: string,
    fileName: string
  ): Promise<string | boolean>;

  abstract saveFile(
    fileName: string,
    data: FileData
  ): Promise<string | boolean>;
}
