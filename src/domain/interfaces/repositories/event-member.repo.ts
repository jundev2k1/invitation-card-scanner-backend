import { PaginatedResult } from "@/src/application/common";
import { EventMemberDto } from "@/src/application/features/event-members/dtos";

export interface IEventMemberRepo {
  getMembersByEventId(eventId: string, keyword: string, page: number, pageSize: number): Promise<PaginatedResult<EventMemberDto>>;

  addMember(eventId: string, userId: string): Promise<void>;

  removeMember(eventId: string, userId: string): Promise<void>;
}
