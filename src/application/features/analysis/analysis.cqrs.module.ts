import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/infrastracture/database/database.module";
import { RepositoryModule } from "src/infrastracture/repositories/repository.module";
import { SecurityModule } from "src/infrastracture/security/security.module";
import { GetGeneralStatisticsHandler } from "./queries/get-general-statistics/get-general-statistics.handler";

const queries = [
  GetGeneralStatisticsHandler,
];
const commands = [];

@Module({
  imports: [RepositoryModule, SecurityModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class AnalysisCqrsModule { }
