import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand, LoginResult } from "./login.command";
import { Inject } from "@nestjs/common";
import { AUTH_SERVICE } from "src/common/tokens";
import { AuthService } from "src/infrastracture/auth/auth.service";
import { Password } from "src/domain/value-objects";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(@Inject(AUTH_SERVICE) private readonly authService: AuthService) { }

  async execute(request: LoginCommand): Promise<LoginResult> {
    const [token, userInfo] = await this.authService.login(
      request.username,
      Password.of(request.password));

    return new LoginResult(token, userInfo.role.value);
  }
}
