import { OpenApiParameters } from "../../interface/open-api/response-body";
import { loadYaml } from "../../utils";

export function buildRequestBody(requestBody: string | OpenApiParameters[]) {
  if (typeof requestBody === "string") {
    return loadYaml(`data/open-api/schemas/${requestBody}.yaml`);
  }
  return requestBody;
}
