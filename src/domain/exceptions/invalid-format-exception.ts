import { Constants } from "src/common";
import { DomainException } from "./domain-exception";
import { ApiMessageDetail } from "src/common/constants";

export class InvalidFormatException extends DomainException {
  readonly status: number = Constants.HttpStatus.BAD_REQUEST;

  constructor(message: string, messageCode: ApiMessageDetail = Constants.ApiMessages.INVALID_FORMAT) {
    super(message);
    this.code = messageCode;
  }

  static ThrowError(messageCode: ApiMessageDetail): InvalidFormatException {
    return new InvalidFormatException(
      messageCode.message,
      messageCode);
  }

  static InvalidEmail(email: string): InvalidFormatException {
    const message = `The email address '${email}' is not in a valid format.`;
    return new InvalidFormatException(message, Constants.ApiMessages.INVALID_EMAIL_FORMAT);
  }

  static InvalidPhoneNumber(phoneNumber: string): InvalidFormatException {
    const message = `The phone number '${phoneNumber}' is not in a valid format.`;
    return new InvalidFormatException(message, Constants.ApiMessages.INVALID_PHONE_FORMAT);
  }

  static InvalidDate(date: string): InvalidFormatException {
    const message = `The date '${date}' is not in a valid format.`;
    return new InvalidFormatException(message, Constants.ApiMessages.INVALID_DATE_FORMAT);
  }

  static InvalidFormat(value: string): InvalidFormatException {
    const message = `The value '${value}' is not in a valid format.`;
    return new InvalidFormatException(message, Constants.ApiMessages.INVALID_FORMAT);
  }
}
