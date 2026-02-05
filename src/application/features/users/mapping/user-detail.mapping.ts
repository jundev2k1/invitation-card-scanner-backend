import { User } from "src/domain/entities";
import { UserDetailDto } from "../dtos/user-detail.dto";

export const mapToUserDetail = (user: User): UserDetailDto =>
  new UserDetailDto(
    user.id,
    user.username.value,
    user.email.value,
    user.nickName,
    user.sex.value,
    user.phoneNumber.value,
    user.avatarUrl,
    user.bio,
    user.status,
    user.role.value,
    user.createdAt,
    user.updatedAt,
  );
