import * as argon2 from "argon2";
import { IPasswordHasher } from "src/domain/interfaces/security/password-hasher";

export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(raw: string): Promise<string> {
    return argon2.hash(raw);
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, raw);
  }
}
