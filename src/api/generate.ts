import fs from "fs";
import path from "path";
import { GlobalConfig } from "../shared/globals";
import {
  openApiDefinitionsPaths,
  temporalCollections,
} from "./decorators/entry";
import { Logger } from "../utils";

function buildPaths() {
  const collections = temporalCollections;
  for (const endpoint of temporalCollections.objects) {
    const route = collections["routes"][endpoint];
    const method = collections["methods"][endpoint];
    openApiDefinitionsPaths[route] = {};
    openApiDefinitionsPaths[route][method] = {};
    for (const key in collections) {
      if (key == "objects" || key == "routes" || key == "methods") continue;
      openApiDefinitionsPaths[route][method][key] = collections[key][endpoint];
    }
  }
}

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
      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "API documentation for the  application",
      },
      paths: openApiDefinitionsPaths,
    };
  } else if (!openApiDefinitions.paths) {
    console.log("No Paths defined");
    openApiDefinitions.paths = openApiDefinitionsPaths;
  }

  // Append the message to the file
  try {
    fs.writeFileSync(filePath, JSON.stringify(openApiDefinitions));
  } catch (e) {
    Logger.error(`Error writing ${filePath} to ${openApiDefinitions}`, e);
  }
}
