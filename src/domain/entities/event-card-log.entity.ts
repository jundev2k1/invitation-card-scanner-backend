import { UUIdHelper } from "src/common";
import { InvalidParameterException } from "../exceptions";

export class EventCardLog {
  constructor(
    public id: string,
    public cardId: string,
    public scannedBy: string,
    public scannedAt: Date,
    public notes: string | null,
  ) {}

  static create(props: {
    cardId: string;
    scannedBy: string;
    notes: string;
  }): EventCardLog {

    InvalidParameterException.ThrowIfEmptyString(props.cardId, "CardId is required.");
    InvalidParameterException.ThrowIfEmptyString(props.scannedBy, "ScannedBy is required.");

    return new EventCardLog(
      UUIdHelper.createUUIDv7(),
      props.cardId,
      props.scannedBy,
      new Date(),
      props.notes?.trim() ?? '',
    );
  }

  update(notes: string | null): void {
    this.notes = notes?.trim() ?? '';
  }
}
