import { Role } from "@/src/domain/value-objects";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class GetUserSuggestionRequest {
  @ApiProperty({ example: 'user01', required: false })
  @IsOptional()
  public readonly keyword: string;

  @ApiProperty({ example: "['staff', 'admin']", required: false })
  @IsOptional()
  public readonly roles: string[];

  @ApiProperty({ example: "['staff', 'admin']", required: false })
  @IsOptional()
  @Type(() => Number)
  public readonly pageSize: number;
}

export class GetUserSuggestionQuery {
  constructor(
    public readonly keyword: string,
    public readonly roles: Role[],
    public readonly pageSize: number
  ) { }
}