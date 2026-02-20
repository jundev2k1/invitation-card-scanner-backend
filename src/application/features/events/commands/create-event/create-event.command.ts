import { Must } from "@/src/application/common/validators";
import { CategoryId } from "@/src/domain/value-objects";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateEventRequest {
  @ApiProperty({ example: 'ROOT' })
  @Must((value) => value === null || CategoryId.isValid(value), { message: 'ParentID is invalid' })
  public categoryId: string | null = null;

  @ApiProperty({ example: 'Example title.' })
  @IsNotEmpty({ message: 'Title is required.' })
  @MaxLength(50, { message: 'Title must be at most 50 characters' })
  public title: string = '';

  @ApiProperty({ example: 'Example description.' })
  @MaxLength(4000, { message: 'Description must be at most 4000 characters' })
  public description: string = '';

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  @Type(() => Date)
  public startAt: Date = new Date();
  
  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  @Type(() => Date)
  public endAt: Date | null = null;

  @ApiProperty({ example: 'Example location name.' })
  @MaxLength(50, { message: 'Location name must be at most 50 characters' })
  public locationName: string | null = null;

  @ApiProperty({ example: 'Example address.' })
  @MaxLength(255, { message: 'Address must be at most 255 characters' })
  public address: string | null = null;

  @ApiProperty({ example: 'https://example.com/map' })
  @MaxLength(4000, { message: 'Map URL must be at most 4000 characters' })
  public mapUrl: string | null = null;

  @ApiProperty({ example: 'https://example.com/thumbnail' })
  @MaxLength(4000, { message: 'Thumbnail URL must be at most 4000 characters' })
  public thumbnailUrl: string | null = null;
}

export class CreateEventCommand {
  constructor(
    public readonly categoryId: CategoryId | null,
    public readonly title: string,
    public readonly description: string,
    public readonly startAt: Date,
    public readonly endAt: Date | null,
    public readonly locationName: string,
    public readonly address: string,
    public readonly mapUrl: string,
    public readonly thumbnailUrl: string
  ) { }
}
