import fs from "fs";
import path from "path";
export class PathResolver {
  static resolve(...paths: string[]): string {
    let filePath = "";

    if (paths.length > 1) {
      const lastPath = paths[paths.length - 1] || "";
      if (lastPath.startsWith("/")) {
        return path.resolve("views", lastPath.slice(1));
      }
    }
    filePath = path.join(...paths);
    if (!path.isAbsolute(filePath)) {
      filePath = path.join("views", filePath);
    }
    filePath = path.resolve(filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error("Could not find the template " + filePath);
    }
    return filePath;
  }
  static dirname(filePath: string): string {
    if (path.extname(filePath) === "") return filePath;
    return path.dirname(filePath);
  }
}
