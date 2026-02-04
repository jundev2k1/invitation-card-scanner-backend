import { Constants } from "src/common";
import { DomainException } from "./domain-exception";
import { ApiMessageDetail } from "src/common/constants";

export class InvalidFormatException extends DomainException {
  readonly status: number = Constants.HttpStatus.BAD_REQUEST;

  constructor(message: string, messageCode: ApiMessageDetail = Constants.ApiMessages.INVALID_FORMAT, details = null) {
    super(message);
    this.code = messageCode;
    this.errorDetails = details;
  }

  static ThrowError(messageCode: ApiMessageDetail, details = null): InvalidFormatException {
    return new InvalidFormatException(
      messageCode.message,
      messageCode,
      details);
  }

  static InvalidEmail(email: string, details = null): InvalidFormatException {
    const message = `The email address '${email}' is not in a valid format.`;
    return new InvalidFormatException(message, Constants.ApiMessages.INVALID_EMAIL_FORMAT, details);
  }

  static InvalidPhoneNumber(phoneNumber: string, details = null): InvalidFormatException {
    const message = `The phone number '${phoneNumber}' is not in a valid format.`;
    return new InvalidFormatException(message, Constants.ApiMessages.INVALID_PHONE_FORMAT, details);
  }

  static InvalidDate(date: string, details = null): InvalidFormatException {
    const message = `The date '${date}' is not in a valid format.`;
    return new InvalidFormatException(message, Constants.ApiMessages.INVALID_DATE_FORMAT, details);
  }

  static InvalidFormat(value: string, details = null): InvalidFormatException {
    const message = `The value '${value}' is not in a valid format.`;
    return new InvalidFormatException(message, Constants.ApiMessages.INVALID_FORMAT, details);
  }
}
