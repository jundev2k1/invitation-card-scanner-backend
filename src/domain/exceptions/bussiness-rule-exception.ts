import { Constants } from "src/common";
import { DomainException } from "./domain-exception";
import { ApiMessageDetail } from "src/common/constants";

export class BussinessRuleViolationException extends DomainException {
  readonly status: number = Constants.HttpStatus.BAD_REQUEST;

  constructor(message: string, messageCode: ApiMessageDetail, details = null) {
    super(message);
    this.code = messageCode;
    this.errorDetails = details;
  }

  static create(messageCode: ApiMessageDetail, details = null): BussinessRuleViolationException {
    return new BussinessRuleViolationException(
      messageCode.message,
      messageCode,
      details);
  }

  static throwError(messageCode: ApiMessageDetail, details = null): BussinessRuleViolationException {
    throw new BussinessRuleViolationException(
      messageCode.message,
      messageCode,
      details);
  }

  static throw(details = null): BussinessRuleViolationException {
    throw BussinessRuleViolationException.create(Constants.ApiMessages.BUSSINESS_RULE_VIOLATION, details);
  }
}
