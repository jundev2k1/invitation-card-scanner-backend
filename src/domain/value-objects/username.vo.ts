import { InvalidFormatException } from "../exceptions";

export default class UserName {
  private constructor(public readonly value: string) { }

  static of(raw: string): UserName {
    if (!this.isValid(raw))
      throw InvalidFormatException.InvalidFormat('Username must be at least 6 characters');

    return new UserName(raw);
  }

  static isValid(raw: string): boolean {
    return !!raw && raw.length >= 6;
  }
}
