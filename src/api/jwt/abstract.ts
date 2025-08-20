import { JWTPayload } from "jose";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JWTResponse {
  success: boolean;
  token: string;
  expiresAt: string;
}
export abstract class JWTService {
  abstract error: any;
  abstract generateToken(
    payload: JWTPayload,
    key?: string,
    expiresAt?: string
  ): Promise<JWTResponse>;
  abstract verifyToken<P = JWTPayload>(
    token: string,
    key?: string
  ): Promise<(P & JWTPayload) | boolean>;

  abstract decodeToken<P = JWTPayload>(
    token: string
  ): (P & JWTPayload) | boolean;
}
