import { UUIdHelper } from "src/common";
import { UserStatus } from "../enums";
import { InvalidParameterException } from "../exceptions";
import { Email, PhoneNumber, Role, Sex, UserName } from "../value-objects";
import { baseEntity } from "./base.entity";

export class User extends baseEntity<string> {
  constructor(
    public id: string,
    public username: UserName,
    public passwordHash: string,
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

  static create(props: { username: UserName, passwordHash: string, email: Email, role: Role }): User {
    return new User(
      UUIdHelper.createUUIDv7(),
      props.username,
      props.passwordHash.trim(),
      props.email,
      '',
      Sex.male,
      PhoneNumber.empty,
      '',
      '',
      UserStatus.WAITING_FOR_APPROVE,
      props.role,
      new Date(),
      new Date()
    );
  }

  public resetPassword(newPasswordHash: string): void {
    InvalidParameterException.ThrowIfEmptyString(newPasswordHash, "New password hash is required.");

    this.passwordHash = newPasswordHash;
  }

  public updateUserInfo(nickName: string, sex: Sex, bio: string): void {
    InvalidParameterException.ThrowIfEmptyString(nickName, "Name is required.");

    this.nickName = nickName.trim();
    this.sex = sex;
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
