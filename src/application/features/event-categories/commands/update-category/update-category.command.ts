import { CategoryId } from "@/src/domain/value-objects";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";

export class UpdateCategoryInput {
  @ApiProperty({ example: 'Example name.' })
  @IsNotEmpty({ message: 'Name is required.' })
  @MaxLength(50, { message: 'Name must be at most 50 characters' })
  name: string;

  @ApiProperty({ example: 'example-name' })
  @MaxLength(50, { message: 'Slug must be at most 50 characters' })
  slug: string;

  @ApiProperty({ example: 'Example description.' })
  @MaxLength(4000, { message: 'Description must be at most 4000 characters' })
  description: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  sortOrder: number;
}

export class UpdateCategoryCommand {
  constructor(
    public readonly id: CategoryId,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly sortOrder: number
  ) { }
}
