import { InvalidFormatException } from "../exceptions";

export default class CategoryId {
  private constructor(public readonly value: string) { }

  static of(raw: string): CategoryId {
    const rawValue = raw.trim();

    if (!this.isValid(rawValue))
      throw InvalidFormatException.InvalidFormat(raw);

    return new CategoryId(rawValue);
  }

  static isValid(raw: string): boolean {
    const rawValue = raw.trim();
    return !!rawValue
      && rawValue === rawValue.toUpperCase()
      && (rawValue === 'ROOT' || rawValue.length % 3 === 0);
  }

  getLevel(): number {
    return this.value === 'ROOT'
      ? 0
      : this.value.length / 3;
  }

  get isRoot(): boolean { return this.value === 'ROOT'; }
}
