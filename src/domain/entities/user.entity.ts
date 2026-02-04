import { UUIdHelper } from "src/common";
import { baseEntity } from "./base.entity";

export class User extends baseEntity<string> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly hashPassword: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt)
  }

  static create(props: { name: string, email: string, hashPassword: string }): User {
    if (!props.email.includes('@'))
      throw new Error('Invalid email');

    if (!props.name || props.name.trim().length === 0)
      throw new Error('Name is required');

    return new User(
      UUIdHelper.createUUIDv7(),
      props.name.trim(),
      props.email.trim(),
      props.hashPassword.trim(),
      new Date(),
      new Date()
    );
  }
}
