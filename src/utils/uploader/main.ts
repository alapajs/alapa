import path from "path";
import {
  BaseUploadedFile,
  FileUploaderOptions,
  UploadedFile,
  UploadedFileSaveOptions,
} from "./interface/misc";
import { FileUploaderDisk, LocalFileUploaderDisk } from "./interface/disk";

export class FileUploader {
  private disk: FileUploaderDisk;
  private extensions: string[];
  constructor(option?: FileUploaderOptions) {
    this.disk = option?.disk || new LocalFileUploaderDisk(option);
  }
  setExtensions(...extensions: string[]): void {
    this.extensions = extensions;
  }
  private checkExtensions(file: UploadedFile | BaseUploadedFile): boolean {
    return this.extensions.includes(path.extname(file.name));
  }

  file(requestFile: BaseUploadedFile): UploadedFile {
    return {
      name: requestFile.name,
      data: requestFile.data,
      size: requestFile.size,
      encoding: requestFile.encoding,
      extension: path.extname(requestFile.name).replace(".", ""),
      tempFilePath: requestFile.tempFilePath,
      truncated: requestFile.truncated,
      mimetype: requestFile.mimetype,
      md5: requestFile.md5,
      mv: requestFile.mv,
      save: (name?: string, options?: UploadedFileSaveOptions) => {
        return this.disk.save(requestFile, name, options);
      },
    };
  }
}
