import { SearchRequestBase } from "@/src/application/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SearchMemberByEventIdRequest extends SearchRequestBase {
  @ApiProperty({ example: '', format: 'uuid', required: true })
  @IsNotEmpty({ message: 'eventId is required.' })
  public readonly eventId: string;
}

export class SearchMemberByEventIdQuery {
  constructor(
    public readonly eventId: string,
    public readonly keyword: string,
    public readonly page: number,
    public readonly pageSize: number
  ) { }
}
