import { AnyObject } from "../../interface/object";
import { OpenApiResponse } from "../../interface/open-api/response-body";
import { loadYaml } from "../../utils";

export function buildResponse(response: {
  [key: string]: OpenApiResponse | string;
}) {
  const responseData: AnyObject = {};
  Object.keys(response).forEach((code) => {
    const data = response[code];
    if (typeof data === "string") {
      responseData[code] = loadYaml(`data/open-api/schemas/${data}.yaml`);
    } else {
      responseData[code] = {};
      if (data["description"]) {
        responseData[code]["description"] = data["description"];
      }
      if (data["content"]) {
        responseData[code]["content"] = {};
        if (typeof data["content"] === "string") {
          responseData[code]["content"] = loadYaml(
            `data/open-api/schemas/${data["content"]}.yaml`
          );
        } else {
          const content = data["content"] as AnyObject;
          Object.keys(data["content"]).forEach((key) => {
            responseData[code]["content"][key] = {};
            if (content[key]["schema"]) {
              responseData[code]["content"][key]["schema"] = {};
              if (typeof content[key]["schema"] == "string") {
                responseData[code]["content"][key]["schema"] = loadYaml(
                  `data/open-api/schemas/${content[key]["schema"]}.yaml`
                );
              } else {
                if (content[key]["schema"]["items"]) {
                  responseData[code]["content"][key]["schema"]["items"] = {};
                  responseData[code]["content"][key]["schema"]["items"][
                    "type"
                  ] = content[key]["schema"]["items"]["type"];
                  if (typeof content[key]["schema"]["items"] === "string") {
                    responseData[code]["content"][key]["schema"]["items"] =
                      loadYaml(
                        `data/open-api/schemas/${content[key]["schema"]["items"]}.yaml`
                      );
                  } else {
                    if (
                      typeof content[key]["schema"]["items"]["properties"] ===
                      "string"
                    ) {
                      responseData[code]["content"][key]["schema"]["items"][
                        "properties"
                      ] = loadYaml(
                        `data/open-api/schemas/${content[key]["schema"]["items"]["properties"]}.yaml`
                      );
                    }
                  }
                }
              }
              if (content[key]["schema"]["properties"]) {
                if (typeof content[key]["schema"]["properties"] === "string") {
                  responseData[code]["content"][key]["schema"]["properties"] =
                    loadYaml(
                      `data/open-api/schemas/${content[key]["schema"]["properties"]}.yaml`
                    );
                } else {
                  responseData[code]["content"][key]["schema"]["properties"] =
                    content[key]["schema"]["properties"];
                }
              }

              if (content[key]["schema"]["type"]) {
                responseData[code]["content"][key]["schema"]["type"] =
                  content[key]["schema"]["type"];
              }
            }
          });
        }
      }
    }
  });
  return responseData;
}
