import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AUTH_SERVICE, REPO_FACADE, USER_ACCESSOR } from "src/common/tokens";
import { Password } from "src/domain/value-objects";
import { AuthService } from "src/infrastracture/auth";
import { RepositoryFacade } from "src/infrastracture/repositories";
import { UserAccessor } from "src/infrastracture/security";
import { LoginCommand, LoginResult } from "./login.command";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(USER_ACCESSOR) private readonly userAccessor: UserAccessor,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: LoginCommand): Promise<LoginResult> {
    // Authenticate and create a JWT
    const [token, jwtId, userInfo] = await this.authService.login(
      request.username,
      Password.of(request.password));

    // Create a new refresh token
    const [_, refreshToken] = await this.authService.generateRefreshToken(userInfo.id, jwtId);

    return new LoginResult(
      token,
      refreshToken,
      userInfo.role.value);
  }
}
