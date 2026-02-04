import { Inject } from "@nestjs/common";
import { IAuthService } from "src/domain/interfaces/auth/auth.service";
import { UserRepo } from "../repositories/user.repo";
import { PASSWORD_HASHER, USER_REPO } from "src/common/tokens";
import { PasswordHasher } from "../security";
import { BadRequestException } from "src/application/common";
import { ApiMessages } from "src/common/constants";
import { JwtService } from "@nestjs/jwt";
import { Password } from "src/domain/value-objects";

export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepo,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService) { }

  async login(username: string, rawPassword: Password): Promise<string> {
    const user = await this.userRepo.getById(username);

    // Validate password
    const hashPassword = await this.passwordHasher.hash(rawPassword.value);
    if (user && user.hashPassword !== hashPassword)
      throw BadRequestException.create(ApiMessages.INVALID_CREDENTIALS);

    // In a real application, generate a JWT or similar token here
    const tokenPayload = { sub: user?.id, username: user?.username };
    return this.jwtService.signAsync(tokenPayload);
  }

  async logout(token: string): Promise<void> {

  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return !!payload;
    } catch {
      return false;
    }
  }
}
