export class EventCardtSearchItemDto {
  constructor(
    public id: string,
    public guest_name: string,
    public status: number,
    public notes: string,
    public created_at: Date,
    public updated_at: Date
  ) { }
}
