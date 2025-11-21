import { IAuthenticatableFields } from "../security/auth/interface/auth-fields";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AutConfiguration {
  resetTokenExpiresMinute?: number;
  authenticatableModel?: new () => IAuthenticatableFields;
  loginUrl?: string;
  dashboardUrl?: string;
}
