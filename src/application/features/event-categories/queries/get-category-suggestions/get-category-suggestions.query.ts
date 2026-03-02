import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetEventCategorySuggestionsRequest {
  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  public readonly keyword: string;

  @ApiProperty({ example: '5', required: false })
  @IsOptional()
  @IsNumber()
  public readonly pageSize: number;
}

export class GetEventCategorySuggestionsQuery {
  constructor(
    public readonly keyword: string,
    public readonly pageSize: number
  ) { }
}
