export class DeleteEventCardCommand {
  constructor(
    public readonly eventId: string,
    public readonly cardId: string
  ) { }
}
