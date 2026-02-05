import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException } from "src/application/common";
import { UUIdHelper } from "src/common";
import { ApiMessages } from "src/common/constants";
import { PASSWORD_HASHER, USER_REPO } from "src/common/tokens";
import { User } from "src/domain/entities";
import { UserStatus } from "src/domain/enums";
import { IAuthService } from "src/domain/interfaces/auth/auth.service";
import { Password } from "src/domain/value-objects";
import { UserRepo } from "../repositories";
import { PasswordHasher } from "../security";
import { JwtPayload } from "./jwt.payload";

export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepo,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService) { }

  async login(username: string, rawPassword: Password): Promise<[string, string, User]> {
    const user = await this.userRepo.getByUsername(username);
    if (!user) throw BadRequestException.create(ApiMessages.INVALID_CREDENTIALS);

    // Validate password
    const isValid = await this.passwordHasher.compare(rawPassword.value, user.passwordHash);
    if (!isValid)
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
    const jwtId = UUIdHelper.createUUIDv7();
    const tokenPayload = new JwtPayload(user?.id, jwtId, user?.role.value);
    return [await this.jwtService.signAsync(tokenPayload), jwtId, user];
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
