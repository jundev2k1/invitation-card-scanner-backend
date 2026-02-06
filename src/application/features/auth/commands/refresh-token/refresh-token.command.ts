import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RefreshTokenRequest {
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'AccessToken is required.' })
  public readonly accessToken: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'RefreshToken is required.' })
  public readonly refreshToken: string;
}

export class RefreshTokenCommand {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string
  ) { }
}

export class RefreshTokenResult {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string
  ) { }
}
