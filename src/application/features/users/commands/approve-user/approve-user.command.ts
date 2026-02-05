import { UUID } from "uuidv7";

export class ApproveUserCommand {
  constructor(public readonly userId: UUID) { }
}
