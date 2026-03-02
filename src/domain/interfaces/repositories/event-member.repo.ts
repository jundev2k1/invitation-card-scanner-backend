import { PaginatedResult } from "@/src/application/common";
import { EventMemberDto } from "@/src/application/features/events/dtos";

export interface IEventMemberRepo {
  getMembersByEventId(eventId: string, keyword: string, page: number, pageSize: number): Promise<PaginatedResult<EventMemberDto>>;

  isExistMember(eventId: string, userId: string): Promise<boolean>;

  addMember(eventId: string, userId: string, roleDesc: string): Promise<void>;

  updateInfo(id: string, roleDesc: string): Promise<void>;

  removeMember(eventId: string, userId: string): Promise<void>;
}
