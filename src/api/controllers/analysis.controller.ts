import { Permission, PermissionGuard } from "@/src/application/common/https";
import { GetGeneralStatisticsQuery, GetGeneralStatisticsRequest } from "@/src/application/features/analysis/queries/get-general-statistics/get-general-statistics.query";
import { DateTimeHelper } from "@/src/common/helpers/date.helper";
import { Role } from "@/src/domain/value-objects";
import { JwtAuthGuard } from "@/src/infrastracture/auth";
import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "../common";

@ApiTags('Analysis')
@Controller('api/backoffice/analysis')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class AnalysisController {
  constructor(
    private readonly queryBus: QueryBus,
  ) { }

  @Get('general')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  async getGeneralStatistics(@Query() parameters: GetGeneralStatisticsRequest) {
    console.log(parameters);
    const query = new GetGeneralStatisticsQuery(
      parameters.startDate || DateTimeHelper.minDate(),
      parameters.endDate || DateTimeHelper.maxDate()
    );
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }
}
