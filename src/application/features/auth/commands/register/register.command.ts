import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";
import { Must } from "src/application/common/validators";
import { Email, Password, PhoneNumber, Sex, UserName } from "src/domain/value-objects";

export class RegisterRequest {
  @ApiProperty({ example: 'user01' })
  @IsNotEmpty({ message: 'Username is required.' })
  @Must((value) => UserName.isValid(value), { message: 'Username must be at least 6 characters' })
  public readonly username: string;

  @ApiProperty({ example: 'user01@example.com' })
  @IsNotEmpty({ message: 'Email is required.' })
  @Must((value) => Email.isValid(value), { message: 'Email is invalid' })
  public readonly email: string;

  @ApiProperty({ example: '123456aA' })
  @IsNotEmpty({ message: 'Password is required.' })
  @Must((value) => Password.isValid(value), { message: 'Password must be at least 8 characters' })
  public readonly password: string;

  @ApiProperty({ example: 'User 01' })
  @IsNotEmpty({ message: 'Nickname is required.' })
  @MaxLength(50, { message: 'Nickname must be at most 50 characters' })
  public readonly nickname: string;

  @ApiProperty({ example: '0123456789' })
  @Must((value) => PhoneNumber.isValid(value), { message: 'Phone number is invalid' })
  @MaxLength(15, { message: 'Phone number must be at most 15 characters' })
  public readonly phoneNumber: string;

  @ApiProperty({ example: 'M' })
  @IsNotEmpty({ message: 'Sex is required.' })
  @Must((value) => Sex.isValid(value), { message: 'Sex is invalid' })
  public readonly sex: string;

  @ApiProperty({ example: 'Example bio.' })
  @MaxLength(4000, { message: 'Bio must be at most 4000 characters' })
  public readonly bio: string;
}

export class RegisterCommand {
  constructor(
    public readonly username: UserName,
    public readonly email: Email,
    public readonly password: Password,
    public readonly nickName: string,
    public readonly phoneNumber: PhoneNumber,
    public readonly sex: Sex,
    public readonly bio: string
  ) { }
}
