import * as argon2 from "argon2";

export const hashPassword = async (rawPassword: string): Promise<string> => {
    return argon2.hash(rawPassword);
}

export const verifyPassword = async (
    plainText: string,
    hashed: string
): Promise<boolean> => {
    return argon2.verify(hashed, plainText);
}
