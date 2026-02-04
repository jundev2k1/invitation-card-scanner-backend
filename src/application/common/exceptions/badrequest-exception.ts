import { Constants } from "src/common";
import { ApplicationException } from "./application-exception";
import { ApiMessageDetail } from "src/common/constants";

export class BadRequestException extends ApplicationException {
  readonly status: number = Constants.HttpStatus.BAD_REQUEST;

  constructor(message: string, messageCode: ApiMessageDetail) {
    super(message);
    this.code = messageCode;
  }

  static create(messageCode: ApiMessageDetail): BadRequestException {
    return new BadRequestException(
      messageCode.message,
      messageCode);
  }

  static validationError(message: string = ''): BadRequestException {
    return new BadRequestException(
      message || Constants.ApiMessages.VALIDATION_ERROR.message,
      Constants.ApiMessages.VALIDATION_ERROR);
  }

  static invalidParameter(message: string = ''): BadRequestException {
    return new BadRequestException(
      message || Constants.ApiMessages.INVALID_PARAMETER.message,
      Constants.ApiMessages.INVALID_PARAMETER);
  }

  static invalidState(message: string = ''): BadRequestException {
    return new BadRequestException(
      message || Constants.ApiMessages.INVALID_STATE.message,
      Constants.ApiMessages.INVALID_STATE);
  }
}
