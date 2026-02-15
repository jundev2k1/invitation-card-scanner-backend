export class EventCardLogDto {
  constructor(
    public readonly id: string,
    public readonly cardId: string,
    public readonly scannedBy: string,
    public readonly scannedAt: Date,
    public readonly note: string | null,
  ) { }
}
