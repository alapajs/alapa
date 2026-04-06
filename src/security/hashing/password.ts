import bcrypt from "bcrypt";

export class HashPassword {
  // Encrypt the password by hashing it with a salt using bcrypt
  public static async encrypt(
    password: string | Buffer,
    saltOrRounds: string | number = 10
  ): Promise<string> {
    return bcrypt.hashSync(password, saltOrRounds);
  }

  // Verify that the password matches the hashed password
  public static async verify(
    password: string | Buffer,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compareSync(password, hashedPassword);
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
