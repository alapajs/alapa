import { Buffer } from "node:buffer";
import { FileUploaderDisk } from "./disk";

export interface BaseUploadedFile {
  name: string;
  data: Buffer;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  md5: string;
  mv: (path: string) => void;
}

export interface UploadedFileSaveOptions {
  directory?: string;
  maxSize?: number;
  overwrite?: boolean;
  allowEmptyFiles?: boolean;
  allowExtensions?: string | string[];
  allowedMimeTypes?: string | string[];
}
export interface UploadedFile extends BaseUploadedFile {
  extension: string;
  save(name?: string, options?: UploadedFileSaveOptions): string | boolean;
}

export interface FileUploaderOptions {
  uploadDir?: string;
  extensions?: string[];
  disk?: FileUploaderDisk;
}
