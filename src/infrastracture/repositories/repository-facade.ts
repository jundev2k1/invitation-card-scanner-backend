import { Inject } from "@nestjs/common";
import { EVENT_CARD_REPO, EVENT_CATEGORY_REPO, EVENT_REPO, REFRESH_TOKEN_REPO, USER_REPO } from "src/common/tokens";
import { EventCardRepo } from "./event-card/event-card.repo";
import { EventCategoryRepo } from "./event-category/event-category.repo";
import { EventRepo } from "./event/event.repo";
import { RefreshTokenRepo } from "./refresh-token/refresh-token.repo";
import { UserRepo } from "./user/user.repo";

export class RepositoryFacade {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepo,
    @Inject(REFRESH_TOKEN_REPO) private readonly refreshTokenRepo: RefreshTokenRepo,
    @Inject(EVENT_CATEGORY_REPO) private readonly eventCategoryRepo: EventCategoryRepo,
    @Inject(EVENT_REPO) private readonly eventRepo: EventRepo,
    @Inject(EVENT_CARD_REPO) private readonly eventCardRepo: EventCardRepo
  ) { }

  get user() { return this.userRepo; }
  get refreshToken() { return this.refreshTokenRepo; }
  get eventCategory() { return this.eventCategoryRepo; }
  get event() { return this.eventRepo; }
  get eventCard() { return this.eventCardRepo; }
}
