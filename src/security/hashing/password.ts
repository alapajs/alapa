import passwordHash from "password-hash";

export class HashPassword {
  // Encrypt the password by hashing it with a salt using bcrypt
  public static async encrypt(password: string): Promise<string> {
    return passwordHash.generate(password);
  }

  // Verify that the password matches the hashed password
  public static async verify(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return passwordHash.verify(password, hashedPassword);
  }

  // Hash the password (alias for encrypt)
  public static hash(password: string): Promise<string> {
    return this.encrypt(password);
  }

  // Validate the password against the hashed password (alias for verify)
  public static validate(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return this.verify(password, hashedPassword);
  }
}
