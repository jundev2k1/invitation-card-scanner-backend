import { Inject } from "@nestjs/common";
import { IAuthService } from "src/domain/interfaces/auth/auth.service";
import { UserRepo } from "../repositories/user.repo";
import { PASSWORD_HASHER, USER_REPO } from "src/common/tokens";
import { PasswordHasher } from "../security";
import { BadRequestException } from "src/application/common";
import { ApiMessages } from "src/common/constants";
import { JwtService } from "@nestjs/jwt";
import { Password } from "src/domain/value-objects";
import { User } from "src/domain/entities";
import { UserStatus } from "src/domain/enums";

export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepo,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService) { }

  async login(username: string, rawPassword: Password): Promise<[string, User]> {
    const user = await this.userRepo.getByUsername(username);
    if (!user) throw BadRequestException.create(ApiMessages.INVALID_CREDENTIALS);

    // Validate password
    const hashPassword = await this.passwordHasher.hash(rawPassword.value);
    if (user.hashPassword !== hashPassword)
      throw BadRequestException.create(ApiMessages.INVALID_CREDENTIALS);

    // Validate user status
    switch (user.status) {
      case UserStatus.INACTIVE:
      case UserStatus.DELETED:
        throw BadRequestException.create(ApiMessages.USER_DISABLED);

      case UserStatus.SUSPENDED:
        throw BadRequestException.create(ApiMessages.USER_LOCKED);

      case UserStatus.WAITING_FOR_APPROVE:
        throw BadRequestException.create(ApiMessages.USER_NOT_APPROVED);
    }

    // Generate access token
    const tokenPayload = { sub: user?.id, username: user?.username };
    return [await this.jwtService.signAsync(tokenPayload), user];
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
