import { Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "src/api/common";
import { Permission, PermissionGuard } from "src/application/common/https";
import { ApproveUserCommand } from "src/application/features/users/commands/approve-user/approve-user.command";
import { GetUserDetailQuery } from "src/application/features/users/queries/get-user-detail/get-user-detail.query";
import { GetUserListQuery, GetUserListRequest } from "src/application/features/users/queries/get-user-list/get-user-list.query";
import { Role } from "src/domain/value-objects";
import { JwtAuthGuard } from "src/infrastracture/auth";
import { UUID } from "uuidv7";

@ApiTags('User - Backoffice')
@Controller('api/backoffice/users')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class UserBackofficeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Get()
  @Permission(Role.admin)
  async getUserList(@Query() parameters: GetUserListRequest) {
    const query = new GetUserListQuery(
      parameters.keyword || '',
      parameters.page || 1,
      parameters.pageSize || 20
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Get(':id')
  @Permission(Role.admin)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async getUserDetail(@Param('id') userId: UUID) {
    const query = new GetUserDetailQuery(userId);
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Post(':id/status/approve')
  @Permission(Role.admin)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async approveUser(@Param('id') userId: UUID) {
    const command = new ApproveUserCommand(userId);
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }
}
