import { Permission, PermissionGuard } from "@/src/application/common/https";
import { ScanCardQuery } from "@/src/application/features/event-cards/queries/scan-card/scan-card.query";
import { Role } from "@/src/domain/value-objects";
import { JwtAuthGuard } from "@/src/infrastracture/auth";
import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiResponseFactory } from "../../common";

@ApiTags('Scans - Client')
@Controller('api/scans')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth('access-token')
export class ScanClientController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Get(':token')
  @Permission(Role.admin, Role.staff)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'token', type: String })
  async scanEventCard(@Param('token') token: string) {
    const query = new ScanCardQuery(token);
    const result = await this.queryBus.execute(query);
    return ApiResponseFactory.ok(result);
  }
}
