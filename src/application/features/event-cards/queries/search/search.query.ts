import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class SearchEventCardsRequest {
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

export class SearchEventCardsQuery {
  constructor(
    public readonly eventId: string,
    public readonly keyword: string,
    public readonly page: number,
    public readonly pageSize: number
  ) { }
}
