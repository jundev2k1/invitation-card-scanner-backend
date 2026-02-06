import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AUTH_SERVICE, REFRESH_TOKEN_GENERATOR, REPO_FACADE, USER_ACCESSOR } from "src/common/tokens";
import { RefreshToken } from "src/domain/entities";
import { Password } from "src/domain/value-objects";
import { AuthService } from "src/infrastracture/auth";
import { RepositoryFacade } from "src/infrastracture/repositories";
import { RefreshTokenGenerator, UserAccessor } from "src/infrastracture/security";
import { LoginCommand, LoginResult } from "./login.command";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(USER_ACCESSOR) private readonly userAccessor: UserAccessor,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    @Inject(REFRESH_TOKEN_GENERATOR) private readonly tokenGenerator: RefreshTokenGenerator,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: LoginCommand): Promise<LoginResult> {
    // Authenticate and create a JWT
    const [token, jwtId, userInfo] = await this.authService.login(
      request.username,
      Password.of(request.password));

    // Create a new refresh token
    const refreshToken = await this.createRefreshTokenAsync(userInfo.id, jwtId);

    return new LoginResult(
      token,
      refreshToken,
      userInfo.role.value);
  }

  private async createRefreshTokenAsync(userId: string, jwtId: string): Promise<string> {
    // Generate refresh token
    const [token, expiryDate] = await this.tokenGenerator.generate();
    
    // Create refresh token
    const { ip, userAgent, device } = this.userAccessor.metaData;
    const refreshToken = RefreshToken.create(userId, token, jwtId, expiryDate, ip, userAgent, device);
    this.repoFacade.refreshToken.create(refreshToken);

    return token;
  }
}
