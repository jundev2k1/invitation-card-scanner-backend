import { GetEventCategorySuggestionsQuery, GetEventCategorySuggestionsRequest } from "@/src/application/features/event-categories/queries/get-category-suggestions/get-category-suggestions.query";
import { SearchCategoriesQuery, SearchCategoriesRequest } from "@/src/application/features/event-categories/queries/search/search.query";
import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "src/api/common";
import { Permission, PermissionGuard } from "src/application/common/https";
import { Role } from "src/domain/value-objects";
import { JwtAuthGuard } from "src/infrastracture/auth";

@ApiTags('Event Categories - Client')
@Controller('api/event-categories')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class EventCategoryClientController {
  constructor(
    private readonly queryBus: QueryBus,
  ) { }

  @Get()
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async getCategories(@Query() parameters: SearchCategoriesRequest) {
    const query = new SearchCategoriesQuery(
      parameters.parentId || '',
      parameters.id || '',
      parameters.keyword || ''
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }

  @Get('suggestions')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async getSuggestions(@Query() parameters: GetEventCategorySuggestionsRequest) {
    const query = new GetEventCategorySuggestionsQuery(
      parameters.keyword?.trim() || '',
      parameters.pageSize || 5
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }
}
