import { UUIdHelper } from "src/common";

export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly hashPassword: string,
    ) { }

    static create(props: { name: string, email: string, hashPassword: string }): User {
        if (!props.email.includes('@'))
            throw new Error('Invalid email');

        if (!props.name || props.name.trim().length === 0)
            throw new Error('Name is required');

        return new User(UUIdHelper.createUUIDv7(), props.name.trim(), props.email.trim(), props.hashPassword.trim());
    }
}
