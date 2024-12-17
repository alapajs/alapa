import { GlobalConfig } from "../../shared/globals";
import swaggerJsdoc, { OAS3Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { Logger } from "../../utils";
import { generateOpenAPIFile } from "./main";
import { Express } from "express";

const noDocumentation = (req: Request, res: Response, next: NextFunction) => {
  res.send("No documentation");
  next();
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
      const swaggerDefinition = JSON.parse(
        fs.readFileSync(
          `${GlobalConfig.api.docs?.openapiDefinitionFile}`,
          "utf8"
        )
      );
      options = {
        definition: swaggerDefinition, // Changed import to require
        apis: [], //
      };
    } catch (error) {
      if (apiConfig?.sync === false) {
        Logger.error(error);
      }
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
