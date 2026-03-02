export class EventCategorySummaryDto {
  constructor(
    public parentId: string,
    public id: string,
    public name: string,
    public slug: string,
    public imageUrl: string
  ) { }
}
