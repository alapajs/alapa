import { Configuration } from "../config";

export let GlobalConfig: Configuration;

export const setGlobalConfig = (config: Configuration) => {
  GlobalConfig = config;
};
