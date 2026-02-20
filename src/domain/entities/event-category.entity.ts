import { EventCategoryStatus } from "../enums";
import { InvalidParameterException } from "../exceptions";
import { CategoryId } from "../value-objects";
import { BaseEntity } from "./base.entity";

export class EventCategory extends BaseEntity<CategoryId> {
  constructor(
    public id: CategoryId,
    public parentId: CategoryId,
    public name: string,
    public slug: string,
    public description: string = '',
    public imageUrl: string = '',
    public status: EventCategoryStatus = EventCategoryStatus.ACTIVE,
    public sortOrder: number = 0,
    public level: number = 1,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(props: {
    id: CategoryId;
    name: string;
    slug: string;
    parentId: CategoryId;
    description?: string;
    imageUrl?: string;
    sortOrder?: number;
  }): EventCategory {
    InvalidParameterException.ThrowIfEmptyString(props.name, "Name is required.");
    InvalidParameterException.ThrowIfEmptyString(props.slug, "Slug is required.");

    return new EventCategory(
      props.id,
      props.parentId,
      props.name.trim(),
      props.slug.trim(),
      props.description?.trim() ?? '',
      props.imageUrl?.trim() ?? '',
      EventCategoryStatus.ACTIVE,
      props.sortOrder ?? 0,
      props.id.getLevel(),
      new Date(),
      new Date()
    );
  }

  public updateInfo(name: string, description: string, imageUrl: string): void {
    InvalidParameterException.ThrowIfEmptyString(name, "Name is required.");

    this.name = name.trim();
    this.description = description?.trim() ?? '';
    this.imageUrl = imageUrl?.trim() ?? '';
  }

  public updateSlug(slug: string): void {
    InvalidParameterException.ThrowIfEmptyString(slug, "Slug is required.");

    this.slug = slug.trim();
  }

  public updateParent(parentId: CategoryId, parentLevel: number = 0): void {
    this.parentId = parentId;
    this.level = parentId ? parentLevel + 1 : 1;
  }

  public updateSortOrder(sortOrder: number): void {
    this.sortOrder = sortOrder;
  }

  public activate(): void {
    this.status = EventCategoryStatus.ACTIVE;
  }

  public deactivate(): void {
    this.status = EventCategoryStatus.INACTIVE;
  }
}
