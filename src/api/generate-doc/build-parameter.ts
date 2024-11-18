import { OpenApiParameters } from "../../interface/open-api/response-body";
import { loadYaml } from "../../utils";

export function buildParameter(parameters: string | OpenApiParameters[]) {
  if (typeof parameters === "string") {
    return loadYaml(`data/open-api/schemas/${parameters}.yaml`);
  }
  return parameters;
}
