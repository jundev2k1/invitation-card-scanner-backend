import { Module } from "@nestjs/common";
import { EVENT_CARD_REPO, EVENT_CATEGORY_REPO, EVENT_MEMBER_REPO, EVENT_REPO, REFRESH_TOKEN_REPO, REPO_FACADE, USER_REPO } from "src/common/tokens";
import { DatabaseModule } from "../database/database.module";
import { EventCardRepo } from "./event-card/event-card.repo";
import { EventCategoryRepo } from "./event-category/event-category.repo";
import { EventMemberRepo } from "./event-member/event-member.repo";
import { EventRepo } from "./event/event.repo";
import { RefreshTokenRepo } from "./refresh-token/refresh-token.repo";
import { RepositoryFacade } from "./repository-facade";
import { UserRepo } from "./user/user.repo";

const repoProviders = [
  { provide: REPO_FACADE, useClass: RepositoryFacade },
  { provide: USER_REPO, useClass: UserRepo },
  { provide: REFRESH_TOKEN_REPO, useClass: RefreshTokenRepo },
  { provide: EVENT_CATEGORY_REPO, useClass: EventCategoryRepo },
  { provide: EVENT_REPO, useClass: EventRepo },
  { provide: EVENT_CARD_REPO, useClass: EventCardRepo },
  { provide: EVENT_MEMBER_REPO, useClass: EventMemberRepo },
];

@Module({
  imports: [DatabaseModule],
  providers: [...repoProviders],
  exports: [...repoProviders.map(provider => provider.provide)],
})
export class RepositoryModule { }
