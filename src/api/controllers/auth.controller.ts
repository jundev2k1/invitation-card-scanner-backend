import { Controller, Post } from "@nestjs/common";
import { ApiResponseFactory } from "../common/response/apiResponseFactory";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor() { }

  @Post('login')
  async login() {
    return ApiResponseFactory.noContent();
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