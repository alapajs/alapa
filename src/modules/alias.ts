/* eslint-disable @typescript-eslint/no-explicit-any */
import { Map } from "../interface";
import { LoginRequired } from "../security/auth/login-required";

export const AliasList: Map<string, any> = new Map<string, any>({
  auth: LoginRequired,
});

export const withAlias = (alias: Map<string, any>) => {
  AliasList.addAll(alias);
};
