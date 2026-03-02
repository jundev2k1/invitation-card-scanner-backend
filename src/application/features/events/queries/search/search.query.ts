import { SearchRequestBase } from "@/src/application/common";
import { EventStatus } from "@/src/domain/enums";
import { CategoryId } from "@/src/domain/value-objects";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class SearchEventRequest extends SearchRequestBase {
  @ApiProperty({ example: `[${EventStatus.DRAFT}, ${EventStatus.PUBLISHED}]`, required: false })
  @IsOptional()
  public readonly statuses?: EventStatus[] = [];

  @ApiProperty({ example: '001', required: false })
  @IsOptional()
  public readonly categories?: string[] = [];

  @ApiProperty({ example: new Date().toISOString(), required: false })
  @IsOptional()
  @Type(() => Date)
  public readonly startFrom?: Date | null;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @Type(() => Date)
  public readonly startTo?: Date | null;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @Type(() => Date)
  public readonly endFrom?: Date | null;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @Type(() => Date)
  public readonly endTo?: Date | null;

  @ApiProperty({ example: 'createdAt', required: false })
  @IsOptional()
  public readonly sortBy?: string | 'startAt' | 'createdAt' | 'status';

  @ApiProperty({ example: 'desc', required: false })
  @IsOptional()
  public readonly sortOrder?: 'asc' | 'desc' = 'desc';
}

export class SearchEventQuery {
  constructor(
    public readonly keyword: string,
    public readonly statuses: EventStatus[],
    public readonly categories: CategoryId[],
    public readonly startFrom: Date | null,
    public readonly startTo: Date | null,
    public readonly endFrom: Date | null,
    public readonly endTo: Date | null,
    public readonly sortBy: string,
    public readonly sortOrder: string,
    public readonly page: number,
    public readonly pageSize: number
  ) { }
}
