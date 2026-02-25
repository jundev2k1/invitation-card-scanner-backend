export class EventCardLogDto {
  constructor(
    public readonly id: string,
    public readonly cardId: string,
    public readonly scannedById: string,
    public readonly scannedByName: string,
    public readonly scannedAt: Date,
    public readonly note: string | null,
  ) { }
}
