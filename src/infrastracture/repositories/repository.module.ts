import { Module } from "@nestjs/common";
import { REFRESH_TOKEN_REPO, REPO_FACADE, USER_REPO } from "src/common/tokens";
import { DatabaseModule } from "../database/database.module";
import { RefreshTokenRepo } from "./refresh-token/refresh-token.repo";
import { RepositoryFacade } from "./repository-facade";
import { UserRepo } from "./user/user.repo";

const repoProviders = [
  { provide: REPO_FACADE, useClass: RepositoryFacade },
  { provide: USER_REPO, useClass: UserRepo },
  { provide: REFRESH_TOKEN_REPO, useClass: RefreshTokenRepo },
];

@Module({
  imports: [DatabaseModule],
  providers: [...repoProviders],
  exports: [...repoProviders.map(provider => provider.provide)],
})
export class RepositoryModule { }
