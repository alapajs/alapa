/* eslint-disable @typescript-eslint/no-explicit-any */
import * as allModel from "typeorm";

const handler = {
  get(target: any, prop: string) {
    if (prop === "Auth") {
      return undefined; // Exclude Auth model
    }
    return target[prop];
  },
};

const proxiedModels = new Proxy(allModel, handler);

export default proxiedModels;
