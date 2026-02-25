import { EventCardLogDto } from "../../event-card-logs/dtos";

export class EventCardDto {
  constructor(
    public readonly id: string,
    public readonly eventId: string,
    public readonly guestName: string,
    public readonly accessToken: string,
    public readonly isUsed: boolean,
    public readonly firstScannedAt: Date | null,
    public readonly status: number,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly scannedLogs: EventCardLogDto[] = []
  ) { }
}
