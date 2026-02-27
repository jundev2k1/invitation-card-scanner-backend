import { EventCardStatus, EventStatus } from "@/src/domain/enums";
import { EventCardLogDto } from "../../event-card-logs/dtos";

export class EventCardDetailDto {
  constructor(
    public readonly id: string,
    public readonly eventId: string,
    public readonly eventTitle: string,
    public readonly startAt: Date,
    public readonly endAt: Date | null,
    public readonly location: string,
    public readonly address: string,
    public readonly eventStatus: EventStatus,
    public readonly guestName: string,
    public readonly accessToken: string,
    public readonly isUsed: boolean,
    public readonly firstScannedAt: Date | null,
    public readonly cardStatus: EventCardStatus,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public scannedLogs: EventCardLogDto[] = []
  ) { }
}
