/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorageDriver, IStorageDriverError } from "./abstract";
import * as fs from "fs";
import * as path from "path";
import { Logger } from "../utils";
import { StorageConfiguration } from "../config";
import { GlobalConfig } from "../shared/globals";

export class LocalStorageDriver implements StorageDriver {
  name: string;
  absolutePathPath: string;
  absoluteURL: string;
  private config?: StorageConfiguration;
  private staticFilePath: string;

  constructor(absolutePathPath?: string, absoluteURL?: string) {
    this.name = "local";
    this.config = GlobalConfig?.storage;
    this.staticFilePath = GlobalConfig?.view?.staticFilesPath || "static";
    this.absolutePathPath = this.config?.local?.path || "uploads";
    this.absolutePathPath =
      absolutePathPath || path.join(this.staticFilePath, this.absolutePathPath);
    this.absoluteURL =
      absoluteURL || this.config?.local?.url || "http://localhost:3000";
  }
  absolutePath: string;

  error: IStorageDriverError | null = null;

  async saveFile(filePath: string, key: string): Promise<string | boolean> {
    try {
      const targetPath = path.join(this.absolutePathPath, key);
      const fileData: any = fs.readFileSync(filePath);

      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(targetPath, fileData);

      return key;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
}
