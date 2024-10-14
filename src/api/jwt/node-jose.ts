import jose from "node-jose";
import { generateJWTExpiresDate, JWTResponse, JWTService } from "./abstract";

export class JoseJWT implements JWTService {
  private secret: string;
  public error: unknown;

  constructor(secret: string) {
    this.secret = secret;
  }

  generateKey() {
    const keystore = jose.JWK.createKeyStore();
    // const props = {
    //     kid: 'gBdaS-G8RLax2qgObTD94w',
    //     alg: 'A256GCM',
    //     use: 'enc'
    //   };
    return keystore.add(this.secret);
  }

  async generateToken<P>(payload: P, expiresAt: number): Promise<JWTResponse> {
    const key = await this.generateKey();
    const expires = generateJWTExpiresDate(expiresAt);
    const result = await jose.JWS.createSign(
      { format: "compact", alg: "HS256" },
      key
    )
      .update(JSON.stringify(payload))
      .final();
    const token = result.signResult.toString();
    return {
      success: true,
      token,
      expiresAt: expires.date,
    };
  }

  async verifyToken<P>(token: string): Promise<P | boolean> {
    const key = await this.generateKey();
    try {
      const result = await jose.JWS.createVerify(key).verify(token);
      return JSON.parse(result.payload.toString());
    } catch (error) {
      this.error = error;
      return true;
    }
  }
}
