import { ApiProperty } from "@nestjs/swagger";

export class LoginRequest {
  @ApiProperty({ example: 'user01' })
  public readonly username: string;
  @ApiProperty({ example: '123456aA' })
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
