import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export abstract class SearchRequestBase {
  @ApiProperty({ example: '', required: false })
  @IsOptional()
  public readonly keyword?: string = '';

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  public readonly page?: number = 1;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @Type(() => Number)
  public readonly pageSize?: number = 20;
}
