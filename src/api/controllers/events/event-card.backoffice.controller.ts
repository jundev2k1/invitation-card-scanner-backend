import { Permission, PermissionGuard } from "@/src/application/common/https";
import { CreateEventCardCommand, CreateEventCardRequest } from "@/src/application/features/event-cards/commands/create-card/create-card.command";
import { DeleteEventCardCommand } from "@/src/application/features/event-cards/commands/delete-card/delete-card.command";
import { UpdateEventCardCommand, UpdateEventCardRequest } from "@/src/application/features/event-cards/commands/update-card/update-card.command";
import { SearchEventCardsQuery, SearchEventCardsRequest } from "@/src/application/features/event-cards/queries/search/search.query";
import { Role } from "@/src/domain/value-objects";
import { JwtAuthGuard } from "@/src/infrastracture/auth";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "../../common";

@ApiTags('Event Cards - Backoffice')
@Controller('api/backoffice/events/:id/cards')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class EventCardBackofficeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Get()
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async searchEventCards(
    @Param('id') eventId: string,
    @Query() request: SearchEventCardsRequest) {
    const query = new SearchEventCardsQuery(
      eventId,
      request.keyword?.trim() || '',
      request.page || 1,
      request.pageSize || 20
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Post()
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

  @Put(':cardId')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiParam({ name: 'cardId', type: String, format: 'uuid' })
  async updateEventCard(
    @Param('id') eventId: string,
    @Param('cardId') cardId: string,
    @Body() request: UpdateEventCardRequest
  ) {
    const command = new UpdateEventCardCommand(
      eventId,
      cardId,
      request.guestName.trim(),
      request.notes.trim()
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }

  @Delete(':cardId')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiParam({ name: 'cardId', type: String, format: 'uuid' })
  async deleteEventCard(@Param('id') eventId: string, @Param('cardId') cardId: string) {
    const command = new DeleteEventCardCommand(eventId, cardId);
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }
}
