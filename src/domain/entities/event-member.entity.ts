import { UUIdHelper } from "src/common";
import { InvalidParameterException } from "../exceptions";

export class EventMember {
  constructor(
    public id: string,
    public eventId: string,
    public userId: string,
    public assignedRole: string,
    public assignedAt: Date,
  ) { }

  static create(props: {
    eventId: string;
    userId: string;
    role?: string;
  }): EventMember {
    InvalidParameterException.ThrowIfEmptyString(props.eventId, "EventId is required.");
    InvalidParameterException.ThrowIfEmptyString(props.userId, "UserId is required.");

    return new EventMember(
      UUIdHelper.createUUIDv7(),
      props.eventId,
      props.userId,
      props.role ?? '',
      new Date()
    );
  }

  public changeRole(role: string): void {
    this.assignedRole = role;
  }
}
