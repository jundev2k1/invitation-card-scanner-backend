import { Constants, UUIdHelper } from "src/common";
import { EventStatus } from "../enums";
import { InvalidParameterException } from "../exceptions";
import { CategoryId } from "../value-objects";
import { BaseEntity } from "./base.entity";

export class Event extends BaseEntity<string> {
  constructor(
    public id: string,
    public categoryId: CategoryId | null,
    public title: string,
    public description: string = '',
    public startAt: Date,
    public endAt: Date | null,
    public locationName: string | null,
    public address: string = '',
    public mapUrl: string = '',
    public thumbnailUrl: string | null,
    public status: EventStatus = EventStatus.DRAFT,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(props: {
    categoryId: CategoryId | null;
    title: string;
    startAt: Date;
    endAt?: Date | null;
    description?: string;
    locationName?: string | null;
    address?: string;
    mapUrl?: string;
    thumbnailUrl?: string | null;
  }): Event {
    InvalidParameterException.ThrowIfEmptyString(props.title, "Title is required.");

    if (props.endAt && props.endAt < props.startAt)
      throw new InvalidParameterException("End time must be after start time.", Constants.ApiMessages.INVALID_PARAMETER);

    return new Event(
      UUIdHelper.createUUIDv7(),
      props.categoryId,
      props.title.trim(),
      props.description?.trim() ?? '',
      props.startAt,
      props.endAt ?? null,
      props.locationName ?? null,
      props.address?.trim() ?? '',
      props.mapUrl?.trim() ?? '',
      props.thumbnailUrl ?? null,
      EventStatus.DRAFT,
      new Date(),
      new Date(),
    );
  }

  public updateCategory(categoryId: CategoryId | null): void {
    this.categoryId = categoryId;
  }

  public updateBasicInfo(
    title: string,
    description: string,
    thumbnailUrl: string | null,
  ): void {
    InvalidParameterException.ThrowIfEmptyString(title, "Title is required.");

    this.title = title.trim();
    this.description = description?.trim() ?? '';
    this.thumbnailUrl = thumbnailUrl;
  }

  public reschedule(startAt: Date, endAt: Date | null): void {
    if (endAt && endAt < startAt)
      throw new InvalidParameterException("End time must be after start time.", Constants.ApiMessages.INVALID_PARAMETER);

    this.startAt = startAt;
    this.endAt = endAt;
  }

  public updateLocation(
    locationName: string | null,
    address: string,
    mapUrl: string,
  ): void {
    this.locationName = locationName;
    this.address = address?.trim() ?? '';
    this.mapUrl = mapUrl?.trim() ?? '';
  }

  public publish(): void {
    if (this.status !== EventStatus.DRAFT)
      throw new InvalidParameterException("Only draft events can be published.", Constants.ApiMessages.INVALID_STATE);


    this.status = EventStatus.PUBLISHED;
  }

  public cancel(): void {
    this.status = EventStatus.CANCELLED;
  }

  public complete(): void {
    this.status = EventStatus.COMPLETED;
  }
}
