import { phoneRegex } from "src/common/constants";
import { InvalidFormatException } from "../exceptions";

export default class PhoneNumber {
  private constructor(public readonly value: string) { }

  static get empty() { return this.of('') }

  static of(raw: string): PhoneNumber {
    const rawValue = raw.trim();
    if (!this.isValid(rawValue))
      throw InvalidFormatException.InvalidEmail(raw);

    return new PhoneNumber(rawValue);
  }

  static isValid(raw: string): boolean {
    const rawValue = raw.trim();
    return rawValue === '' || phoneRegex.test(rawValue);
  }

  public get hasValue() {
    return !!this.value;
  }
}
