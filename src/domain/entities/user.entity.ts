import { UUIdHelper } from "src/common";
import { baseEntity } from "./base.entity";
import { UserStatus } from "../enums";
import { Email, PhoneNumber, Role, Sex, UserName } from "../value-objects";
import { InvalidParameterException } from "../exceptions";

export class User extends baseEntity<string> {
  constructor(
    public id: string,
    public username: UserName,
    public hashPassword: string,
    public email: Email,
    public nickName: string = '',
    public sex: Sex,
    public phoneNumber: PhoneNumber,
    public avatarUrl: string = '',
    public bio: string = '',
    public status: UserStatus = UserStatus.INACTIVE,
    public role: Role,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(props: { username: UserName, hashPassword: string, email: Email, role: Role }): User {
    return new User(
      UUIdHelper.createUUIDv7(),
      props.username,
      props.hashPassword.trim(),
      props.email,
      '',
      Sex.male(),
      PhoneNumber.empty(),
      '',
      '',
      UserStatus.WAITING_FOR_APPROVE,
      props.role,
      new Date(),
      new Date()
    );
  }

  public resetPassword(newHashedPassword: string): void {
    InvalidParameterException.ThrowIfEmptyString(newHashedPassword, "New password hash is required.");

    this.hashPassword = newHashedPassword;
  }

  public updateUserInfo(nickName: string, bio: string): void {
    InvalidParameterException.ThrowIfEmptyString(nickName, "Name is required.");

    this.nickName = nickName.trim();
    this.bio = bio.trim();
  }

  public updatePhoneNumber(phoneNumber: PhoneNumber): void {
    this.phoneNumber = phoneNumber;
  }

  public updateAvatar(avatarUrl: string): void {
    this.avatarUrl = avatarUrl.trim();
  }

  public disableUser(): void {
    this.status = UserStatus.INACTIVE;
  }

  public approveUser(): void {
    this.status = UserStatus.ACTIVE;
  }

  public suspendUser(): void {
    this.status = UserStatus.SUSPENDED;
  }

  public deleteUser(): void {
    this.status = UserStatus.DELETED;
  }
}
