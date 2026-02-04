import { Constants } from "src/common";
import { ApplicationException } from "./application-exception";
import { ApiMessageDetail } from "src/common/constants";

export class BadRequestException extends ApplicationException {
  readonly status: number = Constants.HttpStatus.BAD_REQUEST;

  constructor(message: string, messageCode: ApiMessageDetail, details = null) {
    super(message);
    this.code = messageCode;
    this.errorDetails = null;
  }

  static create(messageCode: ApiMessageDetail, details = null): BadRequestException {
    return new BadRequestException(
      messageCode.message,
      messageCode,
      details
    );
  }

  static validationError(message: string = '', details = null): BadRequestException {
    return new BadRequestException(
      message || Constants.ApiMessages.VALIDATION_ERROR.message,
      Constants.ApiMessages.VALIDATION_ERROR,
      details
    );
  }

  static invalidParameter(message: string = '', details = null): BadRequestException {
    return new BadRequestException(
      message || Constants.ApiMessages.INVALID_PARAMETER.message,
      Constants.ApiMessages.INVALID_PARAMETER,
      details
    );
  }

  static invalidState(message: string = '', details = null): BadRequestException {
    return new BadRequestException(
      message || Constants.ApiMessages.INVALID_STATE.message,
      Constants.ApiMessages.INVALID_STATE,
      details
    );
  }
}
