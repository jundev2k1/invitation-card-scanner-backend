import { InvalidFormatException } from "../exceptions";

export default class Sex {
  private constructor(public readonly value: string) { }

  static get male(): Sex { return this.of('M'); }
  static get female(): Sex { return this.of('F'); }
  static get other(): Sex { return this.of('O'); }

  static of(raw: string): Sex {
    const rawValue = raw.trim().toUpperCase();

    if (!this.isValid(rawValue))
      throw InvalidFormatException.InvalidFormat(raw);

    return new Sex(rawValue);
  }

  static isValid(raw: string): boolean {
    const rawValue = raw.trim().toUpperCase();
    return ['M', 'F', 'O'].includes(rawValue);
  }
}
