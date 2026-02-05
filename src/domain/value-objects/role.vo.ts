import { InvalidFormatException } from "../exceptions";

export default class Role {
  private constructor(public readonly value: string) { }

  static get root(): Role { return this.of('ROOT'); }
  static get admin(): Role { return this.of('ADMIN'); }
  static get staff(): Role { return this.of('STAFF'); }

  static of(raw: string): Role {
    const rawValue = raw.trim().toUpperCase();

    if (!this.isValid(rawValue))
      throw InvalidFormatException.InvalidFormat(raw);

    return new Role(rawValue);
  }

  static isValid(raw: string): boolean {
    const rawValue = raw.trim().toUpperCase();
    return ['ROOT', 'ADMIN', 'STAFF'].includes(rawValue);
  }
}
