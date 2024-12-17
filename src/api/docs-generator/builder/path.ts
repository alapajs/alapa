import { openApiDefinitionsPaths, temporalCollections } from "./entry";

export function buildPaths() {
  const collections = temporalCollections["routes"] ?? {};
  Object.keys(collections).forEach((key) => {
    const route = collections[key];
    openApiDefinitionsPaths[key] = {};
    Object.keys(route).forEach((method) => {
      openApiDefinitionsPaths[key][method] = {};
      const data = route[method];
      const operationId =
        method +
        "-" +
        key
          .trim()
          .replace(/[\W.]+/g, "-")
          .replace(/^[-]+|[-]+$/g, "");
      openApiDefinitionsPaths[key][method] = data;
      if (!openApiDefinitionsPaths[key][method]["operationId"]) {
        openApiDefinitionsPaths[key][method]["operationId"] = operationId;
      }
      if (data["tags"] && Array.isArray(data["tags"])) {
        openApiDefinitionsPaths[key][method]["tags"] = data["tags"];
      }
    });
  });
}
