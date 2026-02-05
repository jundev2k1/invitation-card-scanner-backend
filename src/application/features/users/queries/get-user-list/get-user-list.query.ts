import { ApiProperty } from "@nestjs/swagger";

export class GetUserListRequest {
  @ApiProperty({ example: '', required: false })
  public readonly keyword?: string = '';

  @ApiProperty({ example: 1, required: false })
  public readonly page?: number = 1;

  @ApiProperty({ example: 20, required: false })
  public readonly pageSize?: number = 20;
}

export class GetUserListQuery {
  constructor(
    public readonly keyword: string,
    public readonly page: number,
    public readonly pageSize: number
  ) { }
}
