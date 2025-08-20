import { JWTPayload, jwtVerify, decodeJwt, SignJWT } from "jose";
import { JWTResponse, JWTService } from "./abstract";
import { getSystemFingerprint, Logger } from "../../utils";
import { GlobalConfig } from "../../shared/globals";
import { JWTConfiguration } from "../../config";
import { ENV } from "../../shared";
import { AnyObject } from "../../interface";
import { v4 as uuidv4 } from "uuid";

export class JoseJWT implements JWTService {
  private config: JWTConfiguration;
  private key: Uint8Array;
  public error: unknown;
  private notBefore?: string;
  private subject?: string;

  setNotBefore(notBefore: string): void {
    this.notBefore = notBefore;
  }

  setSubject(subject: string): void {
    this.subject = subject;
  }

  constructor() {
    this.config = GlobalConfig?.jwt ?? {};
    if (!this.config.secret && ENV !== "production") {
      Logger.warn(
        "JWT secret is not defined — fallback fingerprint will be used."
      );
    }
    const secret =
      this.config.secret ||
      `${getSystemFingerprint()}${process.env.SECRET_KEY || process.env.ENCRYPTION_KEY || ""}`;

    this.key = this.createKey(secret!);
  }

  private createKey(secret: string): Uint8Array {
    return new TextEncoder().encode(secret);
  }

  async generateToken(
    payload: AnyObject,
    overrideKey?: string,
    expiresAt?: string
  ): Promise<JWTResponse> {
    const secretKey = overrideKey ? this.createKey(overrideKey) : this.key;
    const algorithm = this.config.algorithm || "HS256";
    const issuer = this.config.issuer;
    const audience = this.config.audience;
    const expiration = expiresAt || this.config.expiresAt || "1h";

    let jwtBuilder = new SignJWT(payload as JWTPayload)
      .setProtectedHeader({ alg: algorithm })
      .setIssuedAt()
      .setExpirationTime(expiration);

    jwtBuilder.setJti(uuidv4());
    if (this.subject) jwtBuilder.setSubject(this.subject);
    if (this.notBefore) jwtBuilder.setNotBefore(this.notBefore);
    if (issuer) jwtBuilder = jwtBuilder.setIssuer(issuer);
    if (audience) jwtBuilder = jwtBuilder.setAudience(audience);
    const token = await jwtBuilder.sign(secretKey);
    return {
      success: true,
      token: token.toString(),
      expiresAt: new Date(decodeJwt(token).exp! * 1000).toISOString(),
    };
  }

  async verifyToken<P>(
    token: string,
    overrideKey?: string
  ): Promise<P | false> {
    const secretKey = overrideKey ? this.createKey(overrideKey) : this.key;
    try {
      const { payload } = await jwtVerify(token, secretKey, {
        issuer: this.config.issuer,
        audience: this.config.audience,
      });
      return payload as P;
    } catch (error) {
      this.error = error;
      return false;
    }
  }

  decodeToken<P>(token: string): P | false {
    try {
      const payload = decodeJwt(token);
      return payload as P;
    } catch (error) {
      this.error = error;
      return false;
    }
  }
}
