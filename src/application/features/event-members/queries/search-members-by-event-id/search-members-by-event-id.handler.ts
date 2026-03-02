import { PaginatedResult } from "@/src/application/common";
import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventMemberDto } from "../../../events/dtos";
import { SearchMemberByEventIdQuery } from "./search-members-by-event-id.query";

@QueryHandler(SearchMemberByEventIdQuery)
export class SearchMemberByEventIdHandler implements IQueryHandler<SearchMemberByEventIdQuery, PaginatedResult<EventMemberDto>> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: SearchMemberByEventIdQuery) {
    return await this.repoFacade.eventMember.getMembersByEventId(
      request.eventId,
      request.keyword,
      request.page,
      request.pageSize
    );
  }
}
