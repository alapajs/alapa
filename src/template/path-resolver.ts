import fs from "fs";
import path from "path";
import { GlobalConfig } from "../shared/globals";
export class PathResolver {
  static rootDir: string = "";

  static resolve(filePath: string, options?: { currentPath?: string }): string {
    this.updateRoot("views");
    filePath = this.replaceSeparator(this.normalizePath(filePath));
    const dir = this.removeRootDir(
      this.replaceSeparator(this.dirname(options?.currentPath || ""))
    );
    if (filePath.startsWith("/") && !this.hasRoot(filePath)) {
      return path.resolve(this.rootDir, filePath.slice(1));
    }

    if (!path.isAbsolute(filePath)) {
      filePath = path.join(this.rootDir, dir, filePath);
    }

    filePath = path.resolve(filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error("Could not find the template " + filePath);
    }
    return filePath;
  }

  static dirname(filePath: string): string {
    return path.dirname(filePath);
  }
  protected static removeEXTDot(extname: string): string {
    extname = extname.trim();
    if (extname.startsWith(".")) return extname.slice(1, extname.length);
    return extname;
  }

  protected static replaceSeparator(filePath: string): string {
    return this.removeDoubleSlashes(filePath.replace("\\", "/"));
  }
  protected static removeDoubleSlashes(filePath: string): string {
    return filePath.replace("//", "/");
  }
  protected static removeSlashFromTheEnd(filePath: string): string {
    return filePath.replace(/\/+$/, "");
  }
  protected static hasRoot(filePath: string): boolean {
    return filePath.startsWith(this.rootDir);
  }
  protected static updateRoot(defaultExtension: string): void {
    this.rootDir = this.replaceSeparator(
      this.removeSlashFromTheEnd(
        path.resolve(GlobalConfig.templateEngine.viewDir || defaultExtension)
      )
    );
  }
  protected static removeRootDir(filePath: string): string {
    return this.removeSlashFromBeginning(filePath.replace(this.rootDir, ""));
  }
  protected static removeSlashFromBeginning(filePath: string): string {
    return filePath.replace(/^\/+/, "");
  }
  protected static removeDotFromBeginning(filePath: string): string {
    return filePath.replace(/^\.+/, "");
  }

  protected static addExtension(filePath: string, ext?: string): string {
    if (ext == null || ext.length == 0) {
      ext = "html";
    } else if (!this.validExtension(ext)) {
      throw new Error(`Invalid extension: ${ext}`);
    }
    return `${filePath}.${this.removeEXTDot(ext)}`;
  }

  static normalizePath(filePath: string): string {
    const startsWithDot = filePath.startsWith(".");
    filePath = filePath.replace(/\.?\.[/\\]/g, (match) => {
      if (match.includes("..")) return "##/";
      return "#/";
    });
    let ext: string = "";
    if (this.validExtension(path.extname(filePath))) {
      ext = this.removeEXTDot(path.extname(filePath));
      filePath = filePath.replace(new RegExp(`\\.${ext}$`), "");
    }

    if (startsWithDot) {
      filePath = this.removeDotFromBeginning(filePath);
    }
    filePath = filePath.replace(/(\\?\.)/g, (match, dot) => {
      if (dot.startsWith("\\")) return ".";
      return "/";
    });
    if (startsWithDot) {
      filePath = `./${filePath}`;
    }
    filePath = filePath.replace(/#/g, ".");
    return this.addExtension(filePath, ext);
  }
  protected static validExtension(ext: string): boolean {
    if (ext.trim().length == 0) return false;
    ext = this.removeEXTDot(ext);
    const commonFileExtension = ["html"];
    const extensions: string | string[] | undefined =
      GlobalConfig.templateEngine.fileExtensions;

    if (Array.isArray(extensions)) {
      commonFileExtension.push(...extensions);
    }
    if (typeof extensions === "string") {
      commonFileExtension.push(...extensions.trim().split(","));
    }
    return (
      commonFileExtension.includes(ext) ||
      commonFileExtension.includes(`.${ext}`)
    );
  }
}
