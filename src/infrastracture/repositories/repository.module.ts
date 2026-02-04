import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { UserRepo } from "./user.repo";
import { USER_REPO } from "src/common/tokens";

const repoProviders = [
  { provide: USER_REPO, useClass: UserRepo },
];

@Module({
  imports: [DatabaseModule],
  providers: [...repoProviders],
  exports: [...repoProviders.map(provider => provider.provide)],
})
export class RepositoryModule { }
