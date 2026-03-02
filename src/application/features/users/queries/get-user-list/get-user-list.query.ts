import { SearchRequestBase } from "@/src/application/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { UserStatus } from "src/domain/enums";

export class GetUserListRequest extends SearchRequestBase {
  @ApiProperty({ example: `[${UserStatus.ACTIVE}]`, required: false })
  @IsOptional()
  public readonly statuses?: UserStatus[] = [];

  @ApiProperty({ example: 'createdAt', required: false })
  @IsOptional()
  public readonly sortBy?: string;

  @ApiProperty({ example: 'desc', required: false })
  @IsOptional()
  public readonly sortOrder?: 'asc' | 'desc' = 'desc';
}

export class GetUserListQuery {
  constructor(
    public readonly keyword: string,
    public readonly statuses: UserStatus[],
    public readonly sortBy: string,
    public readonly sortOrder: string,
    public readonly page: number,
    public readonly pageSize: number
  ) { }
}
