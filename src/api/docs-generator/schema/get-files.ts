import fs from "fs";
import path from "path";
import { Logger } from "../../../utils";

export async function getYamlFiles(directory: string): Promise<string[]> {
  directory = path.resolve(directory);
  if (!fs.existsSync(directory)) {
    Logger.warn(`Could not find file docs directory ${directory}`);
  }
  let result: string[] = [];

  const files = await fs.promises.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    const stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      result = result.concat(await getYamlFiles(filePath)); // Recursive call for subdirectories
    } else if (
      stats.isFile() &&
      (filePath.endsWith(".yaml") || filePath.endsWith(".yml"))
    ) {
      result.push(filePath);
    }
  }

  return result;
}
