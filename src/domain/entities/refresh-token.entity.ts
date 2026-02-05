import { createHash } from "crypto";
import { UUIdHelper } from "src/common";
import { baseEntity } from "./base.entity";

export class RefreshToken extends baseEntity<string> {
  constructor(
    public id: string,
    public userId: string,
    public tokenHash: string,
    public jwtId: string,
    public isRevoked: boolean,
    public expiredAt: Date,
    public replacedByToken: string | null = null,
    public ipAddress: string = '',
    public userAgent: string = '',
    public deviceName: string = '',
    public createdAt: Date = new Date(),
  ) {
    super(id, createdAt, createdAt)
  }

  static create(
    userId: string,
    jwtId: string,
    expiredAt: Date,
    ipAddress: string,
    userAgent: string,
    deviceName: string
  ): RefreshToken {
    return new RefreshToken(
      UUIdHelper.createUUIDv7(),
      userId,
      this.createTokenHash(),
      jwtId,
      false,
      expiredAt,
      null,
      ipAddress,
      userAgent,
      deviceName,
      new Date()
    );
  }

  static createTokenHash(): string {
    return createHash('sha256').update(UUIdHelper.createUUIDv7()).digest('hex');
  }
}
