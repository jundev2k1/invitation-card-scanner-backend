export class EventCategoryDto {
  constructor(
    public parentId: string,
    public id: string,
    public name: string,
    public slug: string,
    public description: string,
    public imageUrl: string,
    public status: number,
    public sortOrder: number,
    public level: number
  ) { }
}
