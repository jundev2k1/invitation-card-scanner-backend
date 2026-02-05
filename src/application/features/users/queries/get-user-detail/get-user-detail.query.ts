import { UUID } from "uuidv7";

export class GetUserDetailQuery {
  constructor(
    public readonly userId: UUID
  ) { }
}
