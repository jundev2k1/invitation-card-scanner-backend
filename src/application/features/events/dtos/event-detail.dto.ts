export class EventDetailDto {
  constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly startAt: Date,
    public readonly endAt: Date | null,
    public readonly locationName: string | null,
    public readonly address: string | null,
    public readonly mapUrl: string | null,
    public readonly thumbnailUrl: string | null,
    public readonly status: number,
    public readonly setting: any,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}