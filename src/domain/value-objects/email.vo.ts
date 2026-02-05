import { emailRegex } from "src/common/constants";
import { InvalidFormatException } from "../exceptions";

export default class Email {
  private constructor(public readonly value: string) { }

  static of(raw: string): Email {
    const rawValue = raw.trim();

    if (!this.isValid(rawValue))
      throw InvalidFormatException.InvalidEmail(raw);

    return new Email(rawValue);
  }

  static isValid(raw: string): boolean {
    const rawValue = raw.trim();
    return !!rawValue && emailRegex.test(rawValue);
  }
}
