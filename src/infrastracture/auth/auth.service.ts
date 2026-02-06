import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException } from "src/application/common";
import { UUIdHelper } from "src/common";
import { ApiMessages } from "src/common/constants";
import { PASSWORD_HASHER, REFRESH_TOKEN_GENERATOR, REPO_FACADE, USER_ACCESSOR } from "src/common/tokens";
import { RefreshToken, User } from "src/domain/entities";
import { UserStatus } from "src/domain/enums";
import { IAuthService } from "src/domain/interfaces/auth/auth.service";
import { Password } from "src/domain/value-objects";
import { RepositoryFacade } from "../repositories";
import { PasswordHasher, RefreshTokenGenerator, UserAccessor } from "../security";

export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_ACCESSOR) private readonly userAccessor: UserAccessor,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(REFRESH_TOKEN_GENERATOR) private readonly tokenGenerator: RefreshTokenGenerator,
    private readonly jwtService: JwtService) { }

  async login(username: string, rawPassword: Password): Promise<[string, string, User]> {
    const user = await this.repoFacade.user.getByUsername(username);
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
    const tokenPayload = {
      sub: user?.id,
      jti: jwtId,
      role: user?.role.value
    };
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

  async generateRefreshToken(userId: string, jwtId: string): Promise<string> {
    // Generate refresh token
    const [token, expiryDate] = await this.tokenGenerator.generate();
    
    // Create refresh token
    const { ip, userAgent, device } = this.userAccessor.metaData;
    const refreshToken = RefreshToken.create(userId, token, jwtId, expiryDate, ip, userAgent, device);
    this.repoFacade.refreshToken.create(refreshToken);

    return token;
  }
}
