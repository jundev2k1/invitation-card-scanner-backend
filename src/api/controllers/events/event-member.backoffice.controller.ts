import { Permission, PermissionGuard } from "@/src/application/common/https";
import { AssignMemberCommand, AssignMemberRequest } from "@/src/application/features/event-members/commands/assign-member/assign-member.command";
import { RemoveMemberCommand } from "@/src/application/features/event-members/commands/remove-member/remove-member.command";
import { UpdateMemberInfoCommand, UpdateMemberInfoRequest } from "@/src/application/features/event-members/commands/update-info/update-info.command";
import { SearchMemberByEventIdQuery, SearchMemberByEventIdRequest } from "@/src/application/features/event-members/queries/search-members-by-event-id/search-members-by-event-id.query";
import { Role } from "@/src/domain/value-objects";
import { JwtAuthGuard } from "@/src/infrastracture/auth";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "../../common";

@ApiTags('Event Members - Backoffice')
@Controller('api/backoffice/event-members')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class EventMemberBackofficeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Get()
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async searchEventMembers(@Query() parameters: SearchMemberByEventIdRequest) {
    const query = new SearchMemberByEventIdQuery(
      parameters.eventId,
      parameters.keyword?.trim() || '',
      parameters.page || 1,
      parameters.pageSize || 20
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Post()
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  async assignMember(@Body() request: AssignMemberRequest) {
    const command = new AssignMemberCommand(
      request.eventId,
      request.userId,
      request.assignedRole.trim()
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.created();
  }

  @Put(':id')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async updateEventMember(
    @Param('id') id: string,
    @Body() request: UpdateMemberInfoRequest
  ) {
    const command = new UpdateMemberInfoCommand(
      id,
      request.assignedRole.trim()
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }

  @Delete(':id')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async deleteEventMember(@Param('id') id: string) {
    const command = new RemoveMemberCommand(id);
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }
}
