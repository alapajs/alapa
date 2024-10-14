import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { generateJWTExpiresDate, JWTResponse, JWTService } from "./abstract";

export class JoseJWT implements JWTService {
  private key: Uint8Array;
  public error: unknown;

  constructor(secret: string) {
    this.key = new TextEncoder().encode(secret);
  }
  async generateToken<P>(payload: P, expiresAt?: number): Promise<JWTResponse> {
    const expires = generateJWTExpiresDate(expiresAt);
    const token = await new SignJWT(payload as JWTPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${expires.minutes}m`) // Short-lived access token
      .sign(this.key);

    return {
      success: true,
      token: token.toString(),
      expiresAt: expires.date,
    };
  }

  async verifyToken<P>(token: string): Promise<P | boolean> {
    try {
      const { payload } = await jwtVerify(token, this.key);
      return payload as P;
    } catch (error) {
      this.error = error;
      return false;
    }
  }
}
