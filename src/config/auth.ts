/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AutConfiguration {
  resetTokenExpiresMinute?: number; // Expiry time for password reset tokens (in minutes)
  authenticatableModel: any;
  loginUrl?: string;
  dashboardUrl?: string;
}
