export class UserSummaryDto {
  constructor(
    public readonly id: string,
    public readonly nickname: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly avatarUrl: string
  ) { }
}