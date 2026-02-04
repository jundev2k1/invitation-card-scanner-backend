import { Constants } from "src/common";
import { ApplicationException } from "./application-exception";
import { ApiMessageDetail } from "src/common/constants";

export class ForbiddenException extends ApplicationException {
  readonly status = Constants.HttpStatus.FORBIDDEN;

  constructor(message: string, messageCode: ApiMessageDetail) {
    super(message || messageCode.message);
    this.code = messageCode;
  }

  static create(messageCode: Constants.ApiMessageDetail): ForbiddenException {
    return new ForbiddenException(messageCode.message, messageCode);
  }

  static throwMessage(messageCode: Constants.ApiMessageDetail): ForbiddenException {
    throw new ForbiddenException(messageCode.message, messageCode);
  }

  static throw() {
    throw ForbiddenException.create(Constants.ApiMessages.FORBIDDEN);
  }
}
