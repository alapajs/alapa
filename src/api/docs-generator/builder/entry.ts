/* eslint-disable @typescript-eslint/no-explicit-any */

interface IOpenApiDefinitionsPaths {
  [key: string]: {
    [key: string]: any; // Adjust the type as needed
  };
}

/* eslint-disable prefer-const */
export let openApiDefinitionsPaths: IOpenApiDefinitionsPaths = {};

export const temporalCollections: {
  [key: string]: any;
} = {};
