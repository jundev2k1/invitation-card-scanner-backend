import { CreateCategoryCommand, CreateCategoryInput } from "@/src/application/features/event-categories/commands/create-category/create-category.command";
import { UpdateCategoryCommand, UpdateCategoryInput } from "@/src/application/features/event-categories/commands/update-category/update-category.command";
import { Body, Controller, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "src/api/common";
import { Permission, PermissionGuard } from "src/application/common/https";
import { CategoryId, Role } from "src/domain/value-objects";
import { JwtAuthGuard } from "src/infrastracture/auth";

@ApiTags('Event Categories - Backoffice')
@Controller('api/backoffice/event-categories')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class EventCategoryBackofficeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post()
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  async createCategory(@Body() input: CreateCategoryInput) {
    const command = new CreateCategoryCommand(
      CategoryId.of(input.parentId),
      CategoryId.of(input.cateId),
      input.name?.trim() || '',
      input.slug?.trim() || '',
      input.description?.trim() || '',
      input.sortOrder || 0
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.created();
  }

  @Put(':id')
  @Permission(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  async updateCategory(
    @Param('id') id: string,
    @Body() input: UpdateCategoryInput
  ) {
    const command = new UpdateCategoryCommand(
      CategoryId.of(id),
      input.name?.trim() || '',
      input.slug?.trim() || '',
      input.description?.trim() || '',
      input.sortOrder || 0
    );
    await this.commandBus.execute(command);
    return ApiResponseFactory.noContent();
  }
}
