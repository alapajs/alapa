import { JWTResponse } from "./abstract";
import { JoseJWT } from "./jose";

export class JWT {
  static error: unknown;
  private static jwt = new JoseJWT("hello world");
  private static getConfig() {}
  static async generateToken<P>(payload: P): Promise<JWTResponse> {
    const jwt = await this.jwt.generateToken<P>(payload);
    return {
      success: true,
      token: jwt.token,
      expiresAt: jwt.expiresAt,
      isoDate: jwt.expiresAt.toISOString(),
    };
  }
  static async verifyToken<P>(token: string): Promise<P | boolean> {
    const result = await this.jwt.verifyToken<P>(token);
    if (result === false) {
      this.error = this.jwt.error;
    }
    return result;
  }
}
