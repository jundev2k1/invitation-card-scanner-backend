import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class UpdateMemberInfoRequest {
  @ApiProperty({ example: 'example description' })
  @IsString({ message: 'Assigned role must be a string' })
  @MaxLength(255, { message: 'Assigned role must be at most 255 characters' })
  public readonly assignedRole: string
}

export class UpdateMemberInfoCommand {
  constructor(
    public readonly id: string,
    public readonly assignedRole: any,
  ) { }
}
