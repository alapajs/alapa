import * as fs from "fs";
import path from "path";
import { Logger } from "../../logger";
/**
 * An abstract class that defines a template rendering and compilation interface.
 *
 * Implementations of this class should provide specific logic for rendering
 * templates and compiling source code into strings.
 */
export abstract class TemplateEngine {
  protected abstract extension: string;
  /**
   * Renders a template with the provided data.
   *
   * @param template - The path to the file to read throw error if file now found.
   * @param data - Optional data to be used for rendering the template. The
   *               shape of this data depends on the specific implementation
   *               and the template being used.
   * @returns The rendered string resulting from applying the data to the template.
   */
  async render(template: string, data?: object): Promise<string> {
    try {
      const source = await this.readFileToString(template);
      return this.compile(source, data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw Logger.throw(`Error rendering HTML template: ${err.message}`);
    }
  }
  /**
   * Compiles source code into a string representation.
   *
   * @param source - A string representing the source code to be compiled.
   * @param data - Optional data that may be used during the compilation
   *               process. The specific use of this data depends on the
   *               implementation and the source code being compiled.
   * @returns The compiled string resulting from processing the source code.
   */
  abstract compile(source: string, data?: object): string;
  readFileToString(filePath: string): Promise<string> {
    /**
     * Reads a file at the given path and returns its contents as a string.
     *
     * @param filePath - The path to the file to read.
     * @returns A Promise that resolves to the file contents as a string.
     */
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.resolve(`${filePath}${this.extension}`),
        "utf8",
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }
}
