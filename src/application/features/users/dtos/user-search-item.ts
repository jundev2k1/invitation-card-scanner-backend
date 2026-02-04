import { UserStatus } from "src/domain/enums";

export class UserSearchItem {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly nickname: string,
    public readonly phoneNumber: string,
    public readonly sex: string,
    public readonly avatarUrl: string,
    public readonly status: UserStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date) { }
}