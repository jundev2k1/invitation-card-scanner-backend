export class EventMemberDto {
  constructor(
    public readonly id: string,
    public readonly eventId: string,
    public readonly userId: string,
    public readonly nickname: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly avatarUrl: string,
    public readonly assignedRole: string,
    public readonly assignedAt: Date,
  ) { }
}
