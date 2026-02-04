import { PaginatedResult } from "src/application/common";
import { UserSearchItem } from "src/application/features/users/dtos/user-search-item";
import { User } from "src/domain/entities";
import { Email, PhoneNumber, Role, Sex, UserName } from "src/domain/value-objects";

export const mapToUserEntity = (data: any): User | null => {
  if (!data) return null;

  return new User(
    data.id,
    UserName.of(data.user_name),
    data.hash_password,
    Email.of(data.email),
    data.nickName,
    Sex.of(data.sex),
    PhoneNumber.of(data.phone_number),
    data.avatar_url,
    data.bio,
    data.status,
    Role.of(data.role),
    new Date(data.created_at),
    new Date(data.updated_at));
}

export const mapToSearchResult = (data: readonly any[], page: number, pageSize: number): PaginatedResult<UserSearchItem> => {
  const items = data.map(i => new UserSearchItem(
    i.id,
    i.username,
    i.email,
    i.nickname,
    i.phone_number,
    i.sex,
    i.avatar_url,
    i.status,
    new Date(i.created_at),
    new Date(i.updatedAt)));
  const totalCount = data.length > 0 ? data[0].total_count : 0;
  return new PaginatedResult(
    items,
    items.length,
    totalCount,
    Math.ceil(totalCount / pageSize),
    page,
    pageSize
  );
}