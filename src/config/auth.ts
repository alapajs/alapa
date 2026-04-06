import { IAuthenticatableFields } from "../security/auth/interface/auth-fields";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AutConfiguration {
  /** Reset token expiration time in minutes */
  resetTokenExpiresMinute?: number;
  /** Authenticatable model */
  authenticatableModel?: new () => IAuthenticatableFields;
  /** Login URL */
  loginUrl?: string;
  /** Dashboard URL */
  dashboardUrl?: string;
}
