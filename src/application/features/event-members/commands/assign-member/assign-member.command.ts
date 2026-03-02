import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class AssignMemberRequest {
  @ApiProperty({ example: '', format: 'uuid' })
  @IsString()
  public readonly eventId: string;

  @ApiProperty({ example: '', format: 'uuid' })
  @IsString()
  public readonly userId: string;

  @ApiProperty({ example: 'example description' })
  @IsString()
  @MaxLength(255, { message: 'Assigned role must be at most 255 characters' })
  public readonly assignedRole: string;
}

export class AssignMemberCommand {
  constructor(
    public readonly eventId: string,
    public readonly userId: string,
    public readonly assignedRole: string
  ) { }
}
