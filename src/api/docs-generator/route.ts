import { GlobalConfig } from "../../shared/globals";
import swaggerJsdoc, { OAS3Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { Request, Response } from "express";
import { Logger } from "../../utils";
import { generateOpenAPIFile } from "./main";
import { Express } from "express";

const noDocumentation = (req: Request, res: Response) => {
  return res.send("No documentation");
};

const getApiDefinition = async () => {
  const apiConfig = GlobalConfig.api.docs;
  if (apiConfig?.sync === true) {
    await generateOpenAPIFile();
  }
  let options: OAS3Options | undefined;
  if (apiConfig?.openApiOptions) {
    options = apiConfig.openApiOptions;
  } else if (apiConfig?.openapiDefinitionFile) {
    try {
      const docFile = `${GlobalConfig.api.docs?.openapiDefinitionFile}`;
      if (!fs.existsSync(docFile)) {
        return undefined;
      }
      const swaggerDefinition = JSON.parse(fs.readFileSync(docFile, "utf8"));
      options = {
        definition: swaggerDefinition, // Changed import to require
        apis: [], //
      };
    } catch (error) {
      Logger.error(`Error reading OpenAPI definition file: ${error}`);
      return undefined;
    }
  } else if (apiConfig?.openApiDefinitions) {
    options = {
      definition: apiConfig.openApiDefinitions,
      apis: [], //
    };
  }

  return options;
};

export const setupDocsRoute = async () => {
  const options = await getApiDefinition();
  if (options) {
    docCleanup();
    const swaggerSpec = swaggerJsdoc(options);
    return [swaggerUi.serve, swaggerUi.setup(swaggerSpec)];
  }
  return [noDocumentation];
};

export const activateDocsRoute = async (app: Express) => {
  const docPath = GlobalConfig.api.docs?.path || "/docs";
  const routes = await setupDocsRoute();
  app.use(docPath, ...routes);
};

function docCleanup() {
  if (GlobalConfig.api.docs?.openApiDefinitions) {
    GlobalConfig.api.docs.openApiDefinitions = undefined;
  }
}
