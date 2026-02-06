import { UUIdHelper } from "src/common";
import { baseEntity } from "./base.entity";

export class RefreshToken extends baseEntity<string> {
  constructor(
    public id: string,
    public userId: string,
    public tokenHash: string,
    public jwtId: string,
    public isRevoked: boolean,
    public expiresAt: Date,
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
    tokenHash: string,
    jwtId: string,
    expiresAt: Date,
    ipAddress: string,
    userAgent: string,
    deviceName: string
  ): RefreshToken {
    return new RefreshToken(
      UUIdHelper.createUUIDv7(),
      userId,
      tokenHash,
      jwtId,
      false,
      expiresAt,
      null,
      ipAddress,
      userAgent,
      deviceName,
      new Date()
    );
  }
}
