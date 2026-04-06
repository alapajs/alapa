import crypto from "crypto";
import { md5 } from "../../utils";

const algorithm = "aes-256-cbc";
const defaultKey = "eccf8969b46e20938484029576643fccdcdcfdd2c7df272d5a62e0";
const secretKey = md5(process.env.ENCRYPTION_KEY || defaultKey);
const iv = crypto.randomBytes(16);

export class Encryption {
  static encrypt = (text: string): string | null => {
    try {
      const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(secretKey),
        iv
      );
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return iv.toString("hex") + ":" + encrypted.toString("hex");
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  static decrypt = (text: string): string | null => {
    try {
      const textParts = text.split(":");
      const iv = Buffer.from(textParts.shift()!, "hex");
      const encryptedText = Buffer.from(textParts.join(":"), "hex");
      const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(secretKey),
        iv
      );
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      //console.log(e);
      return null;
    }
  };
}
