import { Constants } from "src/common";
import { DomainException } from "./domain-exception";
import { ApiMessageDetail } from "src/common/constants";
import { InvalidFormatException } from "./invalid-format-exception";

export class InvalidParameterException extends DomainException {
  readonly status: number = Constants.HttpStatus.BAD_REQUEST;

  constructor(message: string, messageCode: ApiMessageDetail) {
    super(message);
    this.code = messageCode;
  }

  static ThrowError(messageCode: ApiMessageDetail): InvalidParameterException {
    throw new InvalidParameterException(
      messageCode.message,
      messageCode);
  }

  static InvalidParameter(paramName: string, paramValue: any): InvalidParameterException {
    const message = `The parameter '${paramName}' has an invalid value: '${paramValue}'.`;
    return new InvalidParameterException(message, Constants.ApiMessages.INVALID_PARAMETER);
  }

  static ThrowIf(condition: boolean, value: string) {
    if (condition) {
      const invalidFormatException = InvalidFormatException.InvalidFormat(value);
      throw new InvalidParameterException(
        invalidFormatException.message,
        Constants.ApiMessages.INVALID_FORMAT);
    }
  }

  static ThrowIfNull(value: any, message: string | null) {
    if (value === null || value === undefined) {
      const errorMessage = message || `A required value is null or undefined.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER);
    }
  }

  static ThrowIfEmptyString(value: string, message: string | null) {
    if (value.trim() === '') {
      const errorMessage = message || `A required string value is empty.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER);
    }
  }

  static ThrowIfGreaterThan(value: number, threshold: number, message: string | null) {
    if (value > threshold) {
      const errorMessage = message || `The value '${value}' exceeds the allowed threshold of '${threshold}'.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER);
    }
  }

  static ThrowIfGreaterThanOrEqual(value: number, threshold: number, message: string | null) {
    if (value >= threshold) {
      const errorMessage = message || `The value '${value}' meets or exceeds the allowed threshold of '${threshold}'.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER);
    }
  }

  static ThrowIfLessThan(value: number, threshold: number, message: string | null) {
    if (value < threshold) {
      const errorMessage = message || `The value '${value}' is below the allowed threshold of '${threshold}'.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER);
    }
  }

  static ThrowIfLessThanOrEqual(value: number, threshold: number, message: string | null) {
    if (value <= threshold) {
      const errorMessage = message || `The value '${value}' meets or is below the allowed threshold of '${threshold}'.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER);
    }
  }
}
