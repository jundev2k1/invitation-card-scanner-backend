import { GetUserSuggestionQuery, GetUserSuggestionRequest } from "@/src/application/features/users/queries/get-user-suggestion/get-user-suggestion.query";
import { Controller, Get, HttpCode, HttpStatus, Inject, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "src/api/common";
import { Permission, PermissionGuard } from "src/application/common/https";
import { GetUserDetailQuery } from "src/application/features/users/queries/get-user-detail/get-user-detail.query";
import { USER_ACCESSOR } from "src/common/tokens";
import { Role } from "src/domain/value-objects";
import { JwtAuthGuard } from "src/infrastracture/auth";
import { UserAccessor } from "src/infrastracture/security";

@ApiTags('User - Client')
@Controller('api/users')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class UserClientController {
  constructor(
    @Inject(USER_ACCESSOR) private readonly userAccessor: UserAccessor,
    private readonly queryBus: QueryBus,
  ) { }

  @Get('suggestions')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async getSuggestions(@Query() parameters: GetUserSuggestionRequest) {
    const roles = Array.isArray(parameters.roles!)
      ? parameters.roles.filter(r => Role.isValid(r)).map(r => Role[r])
      : (parameters.roles && Role.isValid(parameters.roles)
        ? [Role.of(parameters.roles)]
        : []
      );
    const query = new GetUserSuggestionQuery(
      parameters.keyword.trim() || '',
      roles,
      parameters.pageSize || 5
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Get('me')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async getMe() {
    const query = new GetUserDetailQuery(this.userAccessor.userId);
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }
}
