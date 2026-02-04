import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponseFactory } from "src/api/common";
import { ApiTags } from "@nestjs/swagger";
import { LoginCommand, LoginRequest } from "src/application/features/auth/commands/login/login.command";
import { CommandBus } from "@nestjs/cqrs";

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

  @Post('logout')
  async logout() {
    return ApiResponseFactory.noContent();
  }

  @Post('refresh-token')
  async refreshToken() {
    return ApiResponseFactory.noContent();
  }
}