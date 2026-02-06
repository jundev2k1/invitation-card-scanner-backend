import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginRequest {
  @ApiProperty({ example: 'user01' })
  @IsNotEmpty({ message: 'Username is required.' })
  public readonly username: string;

  @ApiProperty({ example: '123456aA' })
  @IsNotEmpty({ message: 'Password is required.' })
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
    public readonly refreshToken: string,
    public readonly role: string
  ) { }
}
