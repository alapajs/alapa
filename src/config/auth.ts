import { IAuthenticatableFields } from "../security/auth/auth.model";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AutConfiguration {
  resetTokenExpiresMinute?: number;
  authenticatableModel?: new () => IAuthenticatableFields;
  loginUrl?: string;
  dashboardUrl?: string;
}
