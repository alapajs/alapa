import jwt from "jsonwebtoken";
import { generateJWTExpiresDate, JWTResponse, JWTService } from "./abstract";

export class JoseJWT implements JWTService {
  private key: string;
  public error: unknown;

  constructor(secret: string) {
    this.key = secret;
  }
  async generateToken<P>(payload: P, expiresAt: number): Promise<JWTResponse> {
    const expires = generateJWTExpiresDate(expiresAt);
    const token = jwt.sign(payload as string | Buffer | object, this.key, {
      expiresIn: `${expires.minutes}m`,
    });
    return {
      success: true,
      token,
      expiresAt: expires.date,
    };
  }

  async verifyToken<P>(token: string): Promise<P | boolean> {
    try {
      return jwt.verify(token, this.key) as P;
    } catch (error) {
      this.error = error;
      return false;
    }
  }
}
