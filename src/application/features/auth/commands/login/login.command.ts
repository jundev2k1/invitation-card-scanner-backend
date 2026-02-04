import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class LoginRequest {
  @ApiProperty({ example: 'user01' })
  @IsNotEmpty({ message: 'Username is required.' })
  public readonly username: string;

  @ApiProperty({ example: '123456aA' })
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be least 8 characters.' })
  public readonly password: string;
}

export class LoginCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) { }
}

export class LoginResult {
  constructor(
    public readonly accessToken: string,
    public readonly role: string
  ) { }
}
