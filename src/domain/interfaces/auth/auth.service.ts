import { User } from "src/domain/entities";
import { Password } from "src/domain/value-objects";

export interface IAuthService {
  login(username: string, rawPassword: Password): Promise<[string, string, User]>;

  logout(token: string): Promise<void>;

  signAccessToken(userId: string, jwtId: string, role: string): Promise<string>;

  validateToken(accessToken: string, refreshToken: string): Promise<{ tokenId: string, userId: string, role: string} | null>;

  generateRefreshToken(userId: string, jwtId: string): Promise<[string, string]>;
}
