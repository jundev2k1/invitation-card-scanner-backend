import { User } from "src/domain/entities";
import { Password } from "src/domain/value-objects";

export interface IAuthService {
  login(username: string, rawPassword: Password): Promise<[string, User]>;

  logout(token: string): Promise<void>;

  validateToken(token: string): Promise<boolean>;
}
