import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";
import { Must } from "src/application/common/validators";
import { Email, PhoneNumber, Sex } from "src/domain/value-objects";
import { UUID } from "uuidv7";

class UpdateUserInput {
  @ApiProperty({ example: 'user01@example.com' })
  @IsNotEmpty({ message: 'Email is required.' })
  @Must((value) => Email.isValid(value), { message: 'Email is invalid' })
  public email: string;

  @ApiProperty({ example: 'User 01' })
  @IsNotEmpty({ message: 'Nickname is required.' })
  @MaxLength(50, { message: 'Nickname must be at most 50 characters' })
  public nickName: string;

  @ApiProperty({ example: 'M' })
  @IsNotEmpty({ message: 'Sex is required.' })
  @Must((value) => Sex.isValid(value), { message: 'Sex is invalid' })
  public sex: string;

  @ApiProperty({ example: '0123456789' })
  @Must((value) => PhoneNumber.isValid(value), { message: 'Phone number is invalid' })
  @MaxLength(15, { message: 'Phone number must be at most 15 characters' })
  public phoneNumber: string;

  @ApiProperty({ example: 'Example bio.' })
  @MaxLength(4000, { message: 'Bio must be at most 4000 characters' })
  public bio: string;
}

export class UpdateUserCommand {
  constructor(public readonly id: UUID, public readonly data: UpdateUserInput) { }
}