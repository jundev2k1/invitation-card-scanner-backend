import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "src/api/common";
import { LoginCommand, LoginRequest } from "src/application/features/auth/commands/login/login.command";
import { RefreshTokenCommand, RefreshTokenRequest } from "src/application/features/auth/commands/refresh-token/refresh-token.command";
import { RegisterCommand, RegisterRequest } from "src/application/features/auth/commands/register/register.command";
import { Email, Password, PhoneNumber, Sex, UserName } from "src/domain/value-objects";

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  @Post('login')
  async login(@Body() request: LoginRequest) {
    const command = new LoginCommand(request.username, request.password);
    const result = await this.commandBus.execute(command);
    return ApiResponseFactory.ok(result);
  }

  @Post('register')
  async register(@Body() request: RegisterRequest) {
    const command = new RegisterCommand(
      UserName.of(request.username),
      Email.of(request.email),
      Password.of(request.password),
      request.nickname.trim(),
      PhoneNumber.of(request.phoneNumber),
      Sex.of(request.sex),
      request.bio.trim());
    await this.commandBus.execute(command);
    return ApiResponseFactory.created();
  }

  @Post('logout')
  async logout() {
    return ApiResponseFactory.noContent();
  }

  @Post('refresh-token')
  async refreshToken(@Body() request: RefreshTokenRequest) {
    console.log(request);
    const command = new RefreshTokenCommand(request.accessToken, request.refreshToken);
    const result = await this.commandBus.execute(command);
    return ApiResponseFactory.ok(result);
  }
}