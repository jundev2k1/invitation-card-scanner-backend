import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";

export class ScanCardRequest {
  @ApiProperty({ example: 'Example notes.' })
  @MaxLength(4000, { message: 'Title must be at most 4000 characters' })
  public notes: string
}

export class ScanCardCommand {
  constructor(
    public readonly eventCardId: string,
    public readonly notes: string
  ) { }
}
