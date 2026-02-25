import { Permission, PermissionGuard } from "@/src/application/common/https";
import { ScanCardCommand, ScanCardRequest } from "@/src/application/features/event-card-logs/commands/scan-card/scan-card.command";
import { GetEventCardDetailQuery } from "@/src/application/features/event-cards/queries/get-detail/get-detail.query";
import { SearchEventCardsQuery, SearchEventCardsRequest } from "@/src/application/features/event-cards/queries/search/search.query";
import { Role } from "@/src/domain/value-objects";
import { JwtAuthGuard } from "@/src/infrastracture/auth";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "../../common";

@ApiTags('Event Cards - Client')
@Controller('api/events/:eventId/cards')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class EventCardClientController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Get()
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async searchEventCards(
    @Param('eventId') eventId: string,
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

  @Get('/:cardId')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'eventId', type: String, format: 'uuid' })
  @ApiParam({ name: 'cardId', type: String, format: 'uuid' })
  async getEventCardDetail(@Param('eventId') eventId: string, @Param('cardId') cardId: string) {
    const query = new GetEventCardDetailQuery(eventId, cardId);
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Post('/:cardId/actions/scan')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'eventId', type: String, format: 'uuid' })
  async scanEventCard(
    @Param('eventId') eventId: string,
    @Param('cardId') cardId: string,
    @Body() request: ScanCardRequest
  ) {
    const command = new ScanCardCommand(
      eventId,
      cardId,
      request.notes.trim()
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.created();
  }
}
