export class EventCardtSearchItemDto {
  constructor(
    public id: string,
    public guestName: string,
    public status: number,
    public notes: string,
    public createdAt: Date,
    public updatedAt: Date
  ) { }
}
