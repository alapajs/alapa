import { Operation, PathItem } from "swagger-jsdoc";
import { OpenApiEntry } from "../../../../api/docs-generator/builder";
interface DocProperties {
  defaultTag?: string;
  docPrefix?: string;
}
export class ControllerDocGenerator {
  private defaultTag?: string;
  private docPrefix?: string;
  constructor(properties: DocProperties) {
    this.defaultTag = properties.defaultTag;
    this.docPrefix = properties.docPrefix || process.env.DEFAULT_PATH_PREFIX;
  }

  getDocPath(path: string): string {
    if (this.docPrefix) {
      path = `${this.docPrefix}/${path}`;
    }
    path = OpenApiEntry.buildPath(path);
    return path;
  }

  generateOperation(path: string, method: string, operation: Operation | null) {
    if (!operation) return;
    path = this.getDocPath(path);
    const item: PathItem = {};
    item[method] = operation;
    OpenApiEntry.add(path, item, this.defaultTag);
  }
  generateMethod(path: string, item: PathItem | null) {
    if (!item) return;
    path = this.getDocPath(path);
    OpenApiEntry.add(path, item, this.defaultTag);
  }
}
