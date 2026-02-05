import { randomUUID } from "crypto";
import { uuidv7 } from "uuidv7";

export const createUUIDv4 = () => {
  return randomUUID();
}

export const createUUIDv7 = () => {
  return uuidv7();
}
