import fs from "fs";
import path from "path";
import { buildSchema, IOpenApiDefinitionsSchema } from "./schema/main";
import { buildPaths } from "./builder/path";
import { GlobalConfig, setGlobalConfig } from "../../shared/globals";
import { Logger } from "../../utils";
import { openApiDefinitionsPaths } from "./builder/entry";
import { Configuration } from "../../config";

export async function generateOpenAPIFile(): Promise<void> {
  const schema: IOpenApiDefinitionsSchema = await buildSchema();
  buildPaths();
  let filePath = GlobalConfig.api?.docs?.openapiDefinitionFile;
  if (!filePath) filePath = "openapi.json";

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  let openApiDefinitions = GlobalConfig.api.docs?.openApiDefinitions;
  if (!openApiDefinitions) {
    openApiDefinitions = {
      openapi: "3.0.0",
      version: "1.0.0",
      servers: [
        {
          url: "http://localhost:3000/api",
          description: "Development Server server",
        },
      ],

      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "API documentation for the  application",
      },
      paths: openApiDefinitionsPaths,
      components: {
        schemas: schema,
      },
    };
  } else {
    if (openApiDefinitions.components) {
      if (!openApiDefinitions.components.schemas) {
        openApiDefinitions.components.schemas = schema;
      } else {
        openApiDefinitions.components.schemas = {
          ...openApiDefinitions.components.schemas,
          ...schema,
        };
      }
    }
    if (!openApiDefinitions.paths) {
      openApiDefinitions.paths = openApiDefinitionsPaths;
    }
  }

  // Append the message to the file
  try {
    fs.writeFileSync(filePath, JSON.stringify(openApiDefinitions));
  } catch (e) {
    Logger.error(`Error writing ${filePath} to ${openApiDefinitions}`, e);
  }
}

export const generateApiDocs = async (config?: Configuration) => {
  if (config) setGlobalConfig(config);
  Logger.info("Generating API documentation...");
  await generateOpenAPIFile();
  Logger.success("API documentation generated successfully");
};
