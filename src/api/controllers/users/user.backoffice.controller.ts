import { UpdateUserCommand, UpdateUserInput } from "@/src/application/features/users/commands/update-user/update-user.command";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "src/api/common";
import { Permission, PermissionGuard } from "src/application/common/https";
import { ApproveUserCommand } from "src/application/features/users/commands/approve-user/approve-user.command";
import { GetUserDetailQuery } from "src/application/features/users/queries/get-user-detail/get-user-detail.query";
import { GetUserListQuery, GetUserListRequest } from "src/application/features/users/queries/get-user-list/get-user-list.query";
import { GetUserStatusCountQuery } from "src/application/features/users/queries/get-user-status-count/get-status-count.query";
import { UserStatus } from "src/domain/enums";
import { Email, PhoneNumber, Role, Sex } from "src/domain/value-objects";
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

  @Get("status/stats")
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async getUserStatusCount() {
    const query = new GetUserStatusCountQuery();
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Get()
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async getUserList(@Query() parameters: GetUserListRequest) {
    const statuses: UserStatus[] = Array.isArray(parameters.statuses!)
      ? parameters.statuses
      : (parameters.statuses ? [parameters.statuses] : []);
    const query = new GetUserListQuery(
      parameters.keyword!,
      statuses,
      parameters.page!,
      parameters.pageSize!
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Get(':id')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async getUserDetail(@Param('id') userId: UUID) {
    const query = new GetUserDetailQuery(userId);
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Put(':id')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async updateUser(@Param('id') userId: UUID, @Body() input: UpdateUserInput) {
    const command = new UpdateUserCommand(
      userId,
      Email.of(input.email),
      input.nickName,
      Sex.of(input.sex),
      PhoneNumber.of(input.phoneNumber),
      input.bio
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }

  @Patch(':id/status/approve')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async approveUser(@Param('id') userId: UUID) {
    const command = new ApproveUserCommand(userId);
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }
}
