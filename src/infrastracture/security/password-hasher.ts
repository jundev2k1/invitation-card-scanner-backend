import * as argon2 from "argon2";
import { PasswordHasher } from "src/domain/security/password-hasher";

export class Argon2PasswordHasher implements PasswordHasher {
  async hash(raw: string): Promise<string> {
    return argon2.hash(raw);
  }

  async compare(raw: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, raw);
  }
}
