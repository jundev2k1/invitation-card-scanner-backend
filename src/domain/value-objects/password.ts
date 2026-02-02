export default class Password {
    private constructor(public readonly value: string) { }

    static of(raw: string): Password {
        if (!this.isValid(raw))
            throw new Error('Password must be at least 8 characters');

        return new Password(raw);
    }

    static isValid(raw: string): boolean {
        return !!raw && raw.length >= 8;
    }
}
