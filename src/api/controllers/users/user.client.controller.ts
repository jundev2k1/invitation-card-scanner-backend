import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
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

  @Get('me')
  @Permission(Role.admin, Role.staff)
  async getMe() {
    const query = new GetUserDetailQuery(this.userAccessor.userId);
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }
}
