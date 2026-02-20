import { Permission, PermissionGuard } from "@/src/application/common/https";
import { CreateEventCommand, CreateEventRequest } from "@/src/application/features/events/commands/create-event/create-event.command";
import { UpdateEventCommand, UpdateEventRequest } from "@/src/application/features/events/commands/update-event/update-event.command";
import { CategoryId, Role } from "@/src/domain/value-objects";
import { JwtAuthGuard } from "@/src/infrastracture/auth";
import { Body, Controller, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
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
}
