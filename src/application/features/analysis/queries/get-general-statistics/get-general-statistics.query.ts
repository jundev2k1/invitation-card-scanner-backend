import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class GetGeneralStatisticsRequest {
  @ApiProperty({ example: new Date().toISOString(), required: false, type: Date })
  @IsOptional()
  @Type(() => Date)
  public readonly startDate?: Date | null;

  @ApiProperty({ example: new Date().toISOString(), required: false, type: Date })
  @IsOptional()
  @Type(() => Date)
  public readonly endDate?: Date | null;
}

export class GetGeneralStatisticsQuery {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) { }
}
