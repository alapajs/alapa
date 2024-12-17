/* eslint-disable @typescript-eslint/no-explicit-any */

import "dotenv/config";

import { openApiDefinitionsPaths } from "../builder/entry";

export function OpenApi(name: string) {
  return function (target: any) {
    console.log("Generation of OpenApi for ", name);
    target["route"] = name;
    console.log(target);
    target.prototype.route = name; // Adds an instance property
    openApiDefinitionsPaths[name] = {};
  };
}
