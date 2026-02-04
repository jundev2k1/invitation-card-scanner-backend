import { Constants } from "src/common";
import { DomainException } from "./domain-exception";
import { ApiMessageDetail } from "src/common/constants";

export class NotFoundException extends DomainException {
  readonly status: number = Constants.HttpStatus.NOT_FOUND;

  constructor(message: string, messageCode: ApiMessageDetail) {
    super(message);
    this.code = messageCode;
  }

  static create(name: string, value: any): NotFoundException {
    const message = `The resource with ${name}='${value}' was not found.`;
    return new NotFoundException(message, Constants.ApiMessages.NOT_FOUND);
  }

  static ThrowError(messageCode: ApiMessageDetail): NotFoundException {
    throw new NotFoundException(
      messageCode.message,
      messageCode);
  }

  static Throw(name: string, value: any): NotFoundException {
    throw this.create(name, value);
  }
}
