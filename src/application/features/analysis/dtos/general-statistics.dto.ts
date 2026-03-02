export interface IGeneralStatisticsRaw {
  total_user_count: string | number;
  unapproved_user_count: string | number;
  active_user_count: string | number;
  new_users_in_period: string | number;
  user_growth_rate_pct: string | number;
  
  total_events_all_time: string | number;
  period_published_events: string | number;
  period_completed_events: string | number;
  event_published_growth_pct: string | number;
  
  total_cards_all_time: string | number;
  total_used_cards_all_time: string | number;
  period_active_cards: string | number;
  period_used_cards: string | number;
  card_active_growth_pct: string | number;
}

export class GeneralStatisticsDto {
  // User Stats
  totalUsers: number;
  unapprovedUsers: number;
  activeUsers: number;
  newUsersInPeriod: number;
  userGrowthRate: number;

  // Event Stats
  totalEvents: number;
  periodPublishedEvents: number;
  periodCompletedEvents: number;
  eventGrowthRate: number;

  // Card Stats
  totalCards: number;
  totalUsedCards: number;
  periodActiveCards: number;
  periodUsedCards: number;
  cardGrowthRate: number;

  constructor(raw: IGeneralStatisticsRaw) {
    this.totalUsers = Number(raw.total_user_count);
    this.unapprovedUsers = Number(raw.unapproved_user_count);
    this.activeUsers = Number(raw.active_user_count);
    this.newUsersInPeriod = Number(raw.new_users_in_period);
    this.userGrowthRate = Number(raw.user_growth_rate_pct);

    this.totalEvents = Number(raw.total_events_all_time);
    this.periodPublishedEvents = Number(raw.period_published_events);
    this.periodCompletedEvents = Number(raw.period_completed_events);
    this.eventGrowthRate = Number(raw.event_published_growth_pct);

    this.totalCards = Number(raw.total_cards_all_time);
    this.totalUsedCards = Number(raw.total_used_cards_all_time);
    this.periodActiveCards = Number(raw.period_active_cards);
    this.periodUsedCards = Number(raw.period_used_cards);
    this.cardGrowthRate = Number(raw.card_active_growth_pct);
  }

  static mapFromRaw(row: IGeneralStatisticsRaw): GeneralStatisticsDto {
    return new GeneralStatisticsDto(row);
  }
}
