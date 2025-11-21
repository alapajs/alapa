import { GlobalConfig } from "../../shared/globals";
import swaggerJsdoc, { OAS3Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { Logger } from "../../utils";
import { generateOpenAPIFile } from "./main";
import { Express } from "express";
import basicAuth from "express-basic-auth";
import { ENV } from "../../shared";

const noDocumentation = (req: Request, res: Response, next: NextFunction) => {
  res.send("No documentation");
  next();
};

const forwardedPrefixSwagger = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const forwardedPrefix = req.headers["x-forwarded-prefix"];
  if (forwardedPrefix) {
    req.originalUrl = forwardedPrefix + req.url;
  }
  next();
};

const getApiDefinition = async () => {
  const apiConfig = GlobalConfig.api.docs;
  if (apiConfig?.sync === true) {
    await generateOpenAPIFile();
  }
  let definition: OAS3Options | undefined;
  if (apiConfig?.openApiOptions) {
    definition = apiConfig.openApiOptions;
  } else if (apiConfig?.openapiDefinitionFile) {
    try {
      const swaggerDefinition = JSON.parse(
        fs.readFileSync(
          `${GlobalConfig.api.docs?.openapiDefinitionFile}`,
          "utf8"
        )
      );
      definition = {
        definition: swaggerDefinition, // Changed import to require
        apis: [], //
      };
    } catch (error) {
      if (apiConfig?.sync === false) {
        Logger.error(error);
      }
    }
  } else if (apiConfig?.openApiDefinitions) {
    definition = {
      definition: apiConfig.openApiDefinitions,
      apis: [], //
    };
  }

  return definition;
};

export const setupDocsRoute = async () => {
  const definition = await getApiDefinition();
  if (definition) {
    docCleanup();
    const options: any = {};
    if (ENV === "development") {
      options["customJs"] = [`http://localhost:${process.env.PORT}/js/app.js`];
    }
    definition;
    const swaggerSpec = swaggerJsdoc(definition);
    return [swaggerUi.serve, swaggerUi.setup(swaggerSpec, options)];
  }
  return [noDocumentation];
};

export const activateDocsRoute = async (app: Express) => {
  const docsConfig = GlobalConfig.api.docs;
  const docPath = docsConfig?.path || "/docs";
  const routes = await setupDocsRoute();
  const [serve, setup] = routes;
  const BasicAuthEnabled = docsConfig?.basicAuthEnabled === true;
  if (BasicAuthEnabled) {
    const USER = docsConfig?.basicAuthUser || "user";
    const PASS = docsConfig?.basicAuthPassword || "pass";
    const docBasicAuth = basicAuth({
      users: { [USER]: PASS },
      challenge: true,
    });

    app.use(
      docPath,
      docBasicAuth, // auth ALWAYS first
      serve
    );

    app.get(docPath, docBasicAuth, setup);
  } else {
    app.use(docPath, serve, setup);
  }
};

function docCleanup() {
  if (GlobalConfig.api.docs?.openApiDefinitions) {
    GlobalConfig.api.docs.openApiDefinitions = undefined;
  }
}
