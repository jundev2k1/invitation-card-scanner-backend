import { UserSummaryDto } from "../../users/dtos";

export class EventCardLogDto {
  constructor(
    public readonly id: string,
    public readonly cardId: string,
    public readonly scannedBy: UserSummaryDto,
    public readonly scannedAt: Date,
    public readonly note: string | null,
  ) { }
}
