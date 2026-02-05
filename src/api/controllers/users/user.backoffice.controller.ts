import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "src/api/common";
import { Permission, PermissionGuard } from "src/application/common/https";
import { ApproveUserCommand } from "src/application/features/users/commands/approve-user/approve-user.command";
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
  ) { }

  @Post(':id/status/approve')
  @Permission(Role.admin)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async approveUser(@Param('id') userId: UUID) {
    const command = new ApproveUserCommand(userId);
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }
}
