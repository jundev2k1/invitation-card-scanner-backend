import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SearchCategoriesRequest {
  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  public readonly parentId?: string = '';

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  public readonly id?: string = '';

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  public readonly keyword?: string = '';
}

export class SearchCategoriesQuery {
  constructor(
    public parentId: string,
    public cateId: string,
    public keyword: string
  ) { }
}
