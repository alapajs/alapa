import { GlobalConfig } from "../shared/globals";
import swaggerJsdoc, { OAS3Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { Logger } from "../utils";
import { generateOpenAPIFile } from "./generate";

const noDocumentation = (req: Request, res: Response, next: NextFunction) => {
  res.send("No documentation");
  next();
};

export const apiDoc = () => {
  const apiConfig = GlobalConfig.api;
  generateOpenAPIFile();

  // Import the swagger configuration file dynamically
  let options: OAS3Options | undefined;

  if (apiConfig.openApiOptions) {
    options = apiConfig.openApiOptions;
  } else if (apiConfig.openapiDefinitionFile) {
    try {
      const swaggerDefinition = JSON.parse(
        fs.readFileSync(`${GlobalConfig.api.openapiDefinitionFile}`, "utf8")
      );
      options = {
        definition: swaggerDefinition, // Changed import to require
        apis: [], //
      };
    } catch (error) {
      Logger.error(error);
      return [noDocumentation];
    }
  } else if (apiConfig.openApiDefinitions) {
    options = {
      definition: apiConfig.openApiDefinitions,
      apis: [], //
    };
  }

  if (options) {
    // Generate Swagger specification
    const swaggerSpec = swaggerJsdoc(options);

    // Set up Swagger UI
    return [swaggerUi.serve, swaggerUi.setup(swaggerSpec)]; // Corrected object key names
  }
  return [noDocumentation];
};
