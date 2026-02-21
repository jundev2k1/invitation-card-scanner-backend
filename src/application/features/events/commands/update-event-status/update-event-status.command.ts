import { EventStatus } from "@/src/domain/enums";

export class UpdateEventStatusCommand {
  constructor(
    public readonly eventId: string,
    public readonly status: EventStatus
  ) { }
}
