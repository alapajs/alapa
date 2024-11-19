import {
  openApiDefinitionsPaths,
  temporalCollections,
} from "../decorators/entry";
import { buildParameter } from "./build-parameter";
import { buildRequestBody } from "./build-request-body";
import { buildResponse } from "./build-response";

export function buildPaths() {
  const collections = temporalCollections["routes"] ?? {};
  const allGeneralTags = temporalCollections["generalTags"] ?? {};
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
      openApiDefinitionsPaths[key][method]["operationId"] = operationId;

      if (data["summary"]) {
        openApiDefinitionsPaths[key][method]["summary"] = data["summary"];
      }

      if (data["description"]) {
        openApiDefinitionsPaths[key][method]["description"] =
          data["description"];
      }

      if (data["tags"] && Array.isArray(data["tags"])) {
        openApiDefinitionsPaths[key][method]["tags"] = data["tags"];
      }

      if (data["security"]) {
        openApiDefinitionsPaths[key][method]["security"] = data["security"];
      }

      if (data["responses"]) {
        openApiDefinitionsPaths[key][method]["responses"] = buildResponse(
          data["responses"]
        );
      }
      if (data["parameters"]) {
        openApiDefinitionsPaths[key][method]["parameters"] = buildParameter(
          data["parameters"]
        );
      }

      if (data["requestBody"]) {
        openApiDefinitionsPaths[key][method]["requestBody"] = buildRequestBody(
          data["requestBody"]
        );
      }
      let tags = data["tags"] || [];
      if (typeof tags === "string") {
        tags = tags.split(",");
      }
      let generalTags = allGeneralTags[key] || [];
      if (typeof generalTags === "string") {
        generalTags = generalTags.split(",");
      }
      openApiDefinitionsPaths[key][method]["tags"] = [...generalTags, ...tags];
    });
  });
}
