import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException } from "src/application/common";
import { UUIdHelper } from "src/common";
import { ApiMessages } from "src/common/constants";
import { APP_CONFIG, PASSWORD_HASHER, REFRESH_TOKEN_GENERATOR, REPO_FACADE, USER_ACCESSOR } from "src/common/tokens";
import { RefreshToken, User } from "src/domain/entities";
import { UserStatus } from "src/domain/enums";
import { IAuthService } from "src/domain/interfaces/auth/auth.service";
import { Password } from "src/domain/value-objects";
import { AppConfigService } from "../config/app-config.service";
import { RepositoryFacade } from "../repositories";
import { PasswordHasher, RefreshTokenGenerator, UserAccessor } from "../security";

export class AuthService implements IAuthService {
  constructor(
    @Inject(APP_CONFIG) private readonly config: AppConfigService,
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
    return [await this.signAccessToken(user.id, jwtId, user.role.value), jwtId, user];
  }

  async logout(token: string): Promise<void> {

  }

  async signAccessToken(userId: string, jwtId: string, role: string): Promise<string> {
    const tokenPayload = {
      sub: userId,
      jti: jwtId,
      role: role,
    };
    return await this.jwtService.signAsync(tokenPayload)
  }

  async validateToken(accessToken: string, refreshToken: string): Promise<{ tokenId: string, userId: string, role: string } | null> {
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        ignoreExpiration: true
      });
      const refreshTokenObj = await this.repoFacade.refreshToken.getByTokenHash(refreshToken);
      if (!refreshTokenObj || refreshTokenObj.isRevoked || payload.jti !== refreshTokenObj.jwtId) return null;

      return { tokenId: refreshTokenObj.id, userId: refreshTokenObj.userId, role: payload.role };
    } catch (ex) {
      console.error(ex);
      return null;
    }
  }

  async generateRefreshToken(userId: string, jwtId: string): Promise<[string, string]> {
    // Generate refresh token
    const [token, expiryDate] = await this.tokenGenerator.generate();

    // Create refresh token
    const { ip, userAgent, device } = this.userAccessor.metaData;
    const refreshToken = RefreshToken.create(userId, token, jwtId, expiryDate, ip, userAgent, device);
    this.repoFacade.refreshToken.create(refreshToken);

    return [refreshToken.id, token];
  }
}
