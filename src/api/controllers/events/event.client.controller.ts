import { Permission, PermissionGuard } from "@/src/application/common/https";
import { CheckInCardCommand, CheckInCardRequest } from "@/src/application/features/event-card-logs/commands/check-in/check-in.command";
import { GetEventDetailQuery } from "@/src/application/features/events/queries/get-detail/get-detail.query";
import { SearchEventQuery, SearchEventRequest } from "@/src/application/features/events/queries/search/search.query";
import { USER_ACCESSOR } from "@/src/common/tokens";
import { CategoryId, Role } from "@/src/domain/value-objects";
import { JwtAuthGuard } from "@/src/infrastracture/auth";
import { UserAccessor } from "@/src/infrastracture/security";
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "../../common";

@ApiTags('Events - Client')
@Controller('api/events')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class EventClientController {
  constructor(
    @Inject(USER_ACCESSOR) private readonly userAccessor: UserAccessor,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) { }

  @Get()
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async searchEvents(@Query() request: SearchEventRequest) {
    const query = new SearchEventQuery(
      request.keyword?.trim() || '',
      request.statuses || [],
      request.categories ? request.categories.filter(CategoryId.isValid).map(id => CategoryId.of(id)) : [],
      request.startFrom || null,
      request.startTo || null,
      request.endFrom || null,
      request.endTo || null,
      request.sortBy || 'created_at',
      request.sortOrder || 'desc',
      request.page || 1,
      request.pageSize || 20
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Get(':id')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async getEventDetail(@Param('id') id: string) {
    const query = new GetEventDetailQuery(id);
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Post(':eventId/cards/:id/check-in')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'eventId', type: String, format: 'uuid' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async checkInEventCard(
    @Param('eventId') eventId: string,
    @Param('id') cardId: string,
    @Body() request: CheckInCardRequest
  ) {
    const command = new CheckInCardCommand(
      eventId,
      cardId,
      request.notes.trim(),
      this.userAccessor.userId.toString()
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.created();
  }
}
