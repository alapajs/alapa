import fs from "fs";
import path from "path";

import { buildPaths } from "./build-path";
import { GlobalConfig } from "../../shared/globals";
import { openApiDefinitionsPaths } from "../decorators/entry";
import { Logger } from "../../utils";

export function generateOpenAPIFile(): void {
  buildPaths();
  let filePath = GlobalConfig.api.openapiDefinitionFile;
  if (!filePath) filePath = "openapi.json";

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  let openApiDefinitions = GlobalConfig.api.openApiDefinitions;
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
    };
  } else if (!openApiDefinitions.paths) {
    openApiDefinitions.paths = openApiDefinitionsPaths;
  }

  // Append the message to the file
  try {
    fs.writeFileSync(filePath, JSON.stringify(openApiDefinitions));
  } catch (e) {
    Logger.error(`Error writing ${filePath} to ${openApiDefinitions}`, e);
  }
}
