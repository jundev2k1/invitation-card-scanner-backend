import { Constants, UUIdHelper } from "src/common";
import { EventCardStatus } from "../enums";
import { InvalidParameterException } from "../exceptions";

export class EventCard {
  constructor(
    public id: string,
    public eventId: string,
    public guestName: string,
    public accessToken: string,
    public isUsed: boolean,
    public firstScannedAt: Date | null,
    public status: EventCardStatus = EventCardStatus.ACTIVE,
    public notes: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) { }

  static create(props: {
    eventId: string,
    guestName: string,
    notes: string,
  }): EventCard {

    InvalidParameterException.ThrowIfEmptyString(props.eventId, "EventId is required.");
    InvalidParameterException.ThrowIfEmptyString(props.guestName, "Guest name is required.");

    return new EventCard(
      UUIdHelper.createUUIDv7(),
      props.eventId,
      props.guestName.trim(),
      UUIdHelper.createUUIDv7(),
      false,
      null,
      EventCardStatus.ACTIVE,
      props.notes,
      new Date(),
      new Date(),
    );
  }

  public rotateAccessToken(): void {
    this.accessToken = UUIdHelper.createUUIDv7();
  }

  public scan(): void {
    if (this.status !== EventCardStatus.ACTIVE)
      throw new InvalidParameterException("Card is not active.", Constants.ApiMessages.INVALID_STATE);

    if (this.isUsed)
      throw new InvalidParameterException("Card has already been used.", Constants.ApiMessages.INVALID_STATE);

    this.isUsed = true;
    this.firstScannedAt = new Date();
  }

  public enable(): void {
    this.status = EventCardStatus.ACTIVE;
  }

  public disable(): void {
    this.status = EventCardStatus.INACTIVE;
  }
}
