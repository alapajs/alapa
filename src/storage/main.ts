import path from "path";
import { StorageDriver } from "./driver/abstract";
import { LocalStorageDriver } from "./driver/local";
import { GlobalConfig } from "../shared/globals";

export class Storage {
  driver: StorageDriver;
  constructor(driver?: StorageDriver) {
    this.driver =
      driver || GlobalConfig?.storage?.driver || new LocalStorageDriver();
  }

  set setDriver(driver: StorageDriver) {
    this.driver = driver;
  }

  get absolutePath(): string {
    return this.driver.absolutePath;
  }
  get baseURL(): string {
    return this.driver.absoluteURL;
  }
  getFullPath(filePath: string): string {
    return path.join(this.absolutePath, filePath);
  }
  getFullURL(filePath: string): string {
    return `${this.baseURL}/${filePath}`;
  }
  saveFile(filePath: string, key: string): Promise<boolean | string> {
    return this.driver.saveFile(filePath, key);
  }
}
