import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";

export class UpdateEventCardRequest {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsNotEmpty({ message: 'EventId is required.' })
  @MaxLength(255, { message: 'EventId must be at most 255 characters' })
  public guestName: string = '';

  @ApiProperty({ example: 'Nguyen Van A' })
  @MaxLength(4000, { message: 'Notes must be at most 4000 characters' })
  public notes: string = '';
}

export class UpdateEventCardCommand {
  constructor(
    public readonly eventId: string,
    public readonly cardId: string,
    public readonly guestName: string,
    public readonly notes: string,
  ) { }
}
