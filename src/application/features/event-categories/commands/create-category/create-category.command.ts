import { Must } from "@/src/application/common/validators";
import { CategoryId } from "@/src/domain/value-objects";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateCategoryInput {
  @ApiProperty({ example: 'ROOT' })
  @Must((value) => CategoryId.isValid(value), { message: 'ParentID is invalid' })
  public parentId: string;

  @ApiProperty({ example: '001' })
  @Must((value) => CategoryId.isValid(value), { message: 'ID is invalid' })
  public cateId: string;

  @ApiProperty({ example: 'Example name.' })
  @IsNotEmpty({ message: 'Name is required.' })
  @MaxLength(50, { message: 'Name must be at most 50 characters' })
  public name: string;

  @ApiProperty({ example: 'example-name' })
  @MaxLength(50, { message: 'Slug must be at most 50 characters' })
  public slug: string;

  @ApiProperty({ example: 'Example description.' })
  @MaxLength(4000, { message: 'Description must be at most 4000 characters' })
  public description: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  public sortOrder: number;
}

export class CreateCategoryCommand {
  constructor(
    public readonly parentId: CategoryId,
    public readonly id: CategoryId,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly sortOrder: number
  ) { }
}
