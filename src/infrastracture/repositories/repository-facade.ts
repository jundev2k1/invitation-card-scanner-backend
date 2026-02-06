import { Inject } from "@nestjs/common";
import { REFRESH_TOKEN_REPO, USER_REPO } from "src/common/tokens";
import { RefreshTokenRepo } from "./refresh-token/refresh-token.repo";
import { UserRepo } from "./user/user.repo";

export class RepositoryFacade {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepo,
    @Inject(REFRESH_TOKEN_REPO) private readonly refreshTokenRepo: RefreshTokenRepo
  ) { }

  get user() { return this.userRepo; }
  get refreshToken() { return this.refreshTokenRepo; }
}
