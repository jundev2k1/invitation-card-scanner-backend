import { Permission, PermissionGuard } from "@/src/application/common/https";
import { CreateEventCommand, CreateEventRequest } from "@/src/application/features/events/commands/create-event/create-event.command";
import { CategoryId, Role } from "@/src/domain/value-objects";
import { JwtAuthGuard } from "@/src/infrastracture/auth";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
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
}
