import { Permission, PermissionGuard } from "@/src/application/common/https";
import { CreateEventCardCommand, CreateEventCardRequest } from "@/src/application/features/event-cards/commands/create-card/create-card.command";
import { CreateEventCommand, CreateEventRequest } from "@/src/application/features/events/commands/create-event/create-event.command";
import { DeleteEventCommand } from "@/src/application/features/events/commands/delete-event/delete-event.command";
import { UpdateEventCommand, UpdateEventRequest } from "@/src/application/features/events/commands/update-event/update-event.command";
import { GetEventDetailQuery } from "@/src/application/features/events/queries/get-detail/get-detail.query";
import { SearchEventQuery, SearchEventRequest } from "@/src/application/features/events/queries/search/search.query";
import { CategoryId, Role } from "@/src/domain/value-objects";
import { JwtAuthGuard } from "@/src/infrastracture/auth";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "../../common";

@ApiTags('Events - Backoffice')
@Controller('api/backoffice/events')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class EventBackofficeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Get()
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  async searchEvents(@Query() request: SearchEventRequest) {
    const query = new SearchEventQuery(
      request.keyword?.trim() || '',
      request.page || 1,
      request.pageSize || 20
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Get(':id')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async getEventDetail(@Param('id') id: string) {
    const query = new GetEventDetailQuery(id);
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Post()
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  async createEvent(@Body() request: CreateEventRequest) {
    const command = new CreateEventCommand(
      request.categoryId ? CategoryId.of(request.categoryId) : null,
      request.title?.trim() || '',
      request.description?.trim() || '',
      request.startAt,
      request.endAt,
      request.locationName?.trim() || '',
      request.address?.trim() || '',
      request.mapUrl?.trim() || '',
      request.thumbnailUrl?.trim() || ''
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.created();
  }

  @Post(':id/cards')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async createEventCard(
    @Param('id') eventId: string,
    @Body() request: CreateEventCardRequest
  ) {
    const command = new CreateEventCardCommand(
      eventId,
      request.guestName.trim(),
      request.notes.trim()
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.created();
  }

  @Put(':id')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async updateEvent(
    @Param('id') id: string,
    @Body() request: UpdateEventRequest
  ) {
    const command = new UpdateEventCommand(
      id,
      request.categoryId ? CategoryId.of(request.categoryId) : null,
      request.title?.trim() || '',
      request.description?.trim() || '',
      request.startAt,
      request.endAt,
      request.locationName?.trim() || '',
      request.address?.trim() || '',
      request.mapUrl?.trim() || '',
      request.thumbnailUrl?.trim() || ''
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }

  @Delete(':id')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async deleteEvent(@Param('id') id: string) {
    const command = new DeleteEventCommand(id);
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }
}
