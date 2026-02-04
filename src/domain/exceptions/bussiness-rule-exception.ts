import { Constants } from "src/common";
import { DomainException } from "./domain-exception";
import { ApiMessageDetail } from "src/common/constants";

export class BussinessRuleViolationException extends DomainException {
  readonly status: number = Constants.HttpStatus.BAD_REQUEST;

  constructor(message: string, messageCode: ApiMessageDetail) {
    super(message);
    this.code = messageCode;
  }

  static create(messageCode: ApiMessageDetail): BussinessRuleViolationException {
    return new BussinessRuleViolationException(
      messageCode.message,
      messageCode);
  }

  static throwError(messageCode: ApiMessageDetail): BussinessRuleViolationException {
    throw new BussinessRuleViolationException(
      messageCode.message,
      messageCode);
  }

  static throw(): BussinessRuleViolationException {
    throw BussinessRuleViolationException.create(Constants.ApiMessages.BUSSINESS_RULE_VIOLATION);
  }
}
