import { GlobalConfig } from "../../shared/globals";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JWTResponse {
  success: boolean;
  token: string;
  isoDate?: string;
  expiresAt: Date;
}
export abstract class JWTService {
  abstract error: any;
  abstract generateToken<P = any>(
    payload: P,
    expiresAt?: number
  ): Promise<JWTResponse>;
  abstract verifyToken<P = any>(token: string): Promise<P | boolean>;
}

export function generateJWTExpiresDate(expiresAt?: number): {
  milliseconds: number;
  date: Date;
  iso: string;
  hours: number;
  minutes: number;
  seconds: number;
} {
  // Default to 60 minutes if expiresAt is not provided
  const expirationTimeInMinutes = Number(
    expiresAt || GlobalConfig.jwt?.expiresAt || process.env.JWT_EXPIRATION || 60
  );

  // Calculate milliseconds from minutes
  const milliseconds = expirationTimeInMinutes * 60 * 1000;
  const date = new Date(Date.now() + milliseconds);

  // Calculate derived values
  const hours = expirationTimeInMinutes / 60; // Convert minutes to hours
  const minutes = expirationTimeInMinutes; // Minutes remain the same
  const seconds = expirationTimeInMinutes * 60; // Convert minutes to seconds

  return {
    milliseconds,
    date,
    iso: date.toISOString(),
    hours,
    minutes,
    seconds,
  };
}
