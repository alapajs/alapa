import path from "path";
import fs from "fs";
import {
  BaseUploadedFile,
  FileUploaderOptions,
  UploadedFileSaveOptions,
} from "./misc";

export interface FileUploaderDisk {
  save(
    file: BaseUploadedFile,
    name?: string,
    option?: UploadedFileSaveOptions
  ): string;
}

export class LocalFileUploaderDisk implements FileUploaderDisk {
  private option?: FileUploaderOptions;
  constructor(options?: FileUploaderOptions) {
    this.option = options;
  }
  save(
    file: BaseUploadedFile,
    name?: string,
    options?: UploadedFileSaveOptions
  ): string {
    name = name || file.name;
    const dir =
      this.option?.uploadDir ?? options?.directory ?? "static/uploads";
    if (!fs.existsSync(path.resolve(dir))) {
      fs.mkdirSync(path.resolve(dir), {
        recursive: true,
      });
    }
    const destPath = path.resolve(dir, name);

    if (options?.maxSize && file.size > options.maxSize) {
      throw new Error("");
    }
    if (options?.overwrite && fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }
    if (options?.allowEmptyFiles && file.size === 0) {
      throw new Error("");
    }
    // if (options?.allowExtensions && !checkExtensions(file.name,options.allowExtensions??[])) {
    //   throw new Error("");
    // }
    if (
      options?.allowedMimeTypes &&
      !options.allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new Error("");
    }
    file.mv(destPath);
    return destPath;
  }
}
