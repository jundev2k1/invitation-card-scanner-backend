export class EventDetailStatsDto {
  constructor(
    public eventId: string,
    public cardStats: EventCardStats,
    public memberStats: EventMemberStats,
  ) { }
}

interface EventCardStats {
  totalCards: number;
  availableCards: number;
  usedCards: number;
}

interface EventMemberStats {
  totalMembers: number;
}
