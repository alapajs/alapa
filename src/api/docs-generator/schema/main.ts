import { GlobalConfig } from "../../../shared/globals";
import { loadYaml } from "../../../utils";
import { getYamlFiles } from "./get-files";

export interface IOpenApiDefinitionsSchema {
  [key: string]: {
    [key: string]: unknown; // Adjust the type as needed
  };
}

export const buildSchema = async (): Promise<IOpenApiDefinitionsSchema> => {
  const directoryPath = GlobalConfig.api.docs?.schemasDir || "docs/schemas";
  const yamlFiles = await getYamlFiles(directoryPath);

  let schema: IOpenApiDefinitionsSchema = {};

  // Use Promise.all to handle multiple async operations concurrently
  const promises = yamlFiles.map(async (file) => {
    const data = await loadYaml(file);
    schema = { ...schema, ...data };
  });

  // Wait for all promises to resolve
  await Promise.all(promises);

  return schema;
};
