import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GetGeneralStatisticsRequest {
  @ApiProperty({ example: new Date().toISOString() })
  @IsOptional()
  public readonly startDate?: Date | null;
  
  @ApiProperty({ example: new Date().toISOString() })
  @IsOptional()
  public readonly endDate?: Date | null;
}

export class GetGeneralStatisticsQuery {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) { }
}
