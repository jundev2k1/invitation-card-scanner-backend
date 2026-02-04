import { Constants } from "src/common";
import { ApplicationException } from "./application-exception";
import { ApiMessageDetail } from "src/common/constants";

export class UnauthorizedException extends ApplicationException {
  readonly code = Constants.ApiMessages.UNAUTHORIZED;
  readonly status = Constants.HttpStatus.UNAUTHORIZED;

  constructor(message: string, messageCode: ApiMessageDetail) {
    super(message || messageCode.message);
    this.code = messageCode;
  }

  static create(messageCode: ApiMessageDetail): UnauthorizedException {
    return new UnauthorizedException(messageCode.message, messageCode);
  }

  static throwMessage(messageCode: ApiMessageDetail) {
    throw new UnauthorizedException(messageCode.message, messageCode);
  }

  static throw() {
    throw UnauthorizedException.create(Constants.ApiMessages.UNAUTHORIZED);
  }
}
