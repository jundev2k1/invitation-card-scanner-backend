import { Module } from "@nestjs/common";
import { AnalysisCqrsModule } from "./analysis/analysis.cqrs.module";
import { AuthCqrsModule } from "./auth/auth.cqrs.module";
import { EventCardLogCqrsModule } from "./event-card-logs/event-card-log.cqrs.module";
import { EventCardCqrsModule } from "./event-cards/event-card.cqrs.module";
import { EventCategoryCqrsModule } from "./event-categories/event-category.cqrs.module";
import { EventMemberCqrsModule } from "./event-members/event-member.cqrs.module";
import { EventCqrsModule } from "./events/event.cqrs.module";
import { UserCqrsModule } from "./users/user.cqrs.module";

const providers = [
  AnalysisCqrsModule,
  AuthCqrsModule,
  UserCqrsModule,
  EventCategoryCqrsModule,
  EventCqrsModule,
  EventCardCqrsModule,
  EventCardLogCqrsModule,
  EventMemberCqrsModule,
];

@Module({
  imports: providers,
  exports: providers,
})
export class CqrsModule { }
