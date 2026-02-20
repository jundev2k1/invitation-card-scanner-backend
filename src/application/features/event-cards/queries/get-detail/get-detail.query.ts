export class GetEventCardDetailQuery {
  constructor(
    public readonly eventId: string,
    public readonly cardId: string
  ) { }
}
