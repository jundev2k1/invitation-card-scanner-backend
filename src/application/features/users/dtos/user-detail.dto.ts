import { UserStatus } from "src/domain/enums";

export class UserDetailDto {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public nickName: string = '',
    public sex: string,
    public phoneNumber: string,
    public avatarUrl: string = '',
    public bio: string = '',
    public status: UserStatus = UserStatus.INACTIVE,
    public role: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) { }
}
