import { Constants } from "src/common";
import { DomainException } from "./domain-exception";
import { ApiMessageDetail } from "src/common/constants";

export class InvalidParameterException extends DomainException {
  readonly status: number = Constants.HttpStatus.BAD_REQUEST;

  constructor(message: string, messageCode: ApiMessageDetail, details = null) {
    super(message);
    this.code = messageCode;
    this.errorDetails = details;
  }

  static ThrowError(messageCode: ApiMessageDetail, details = null): InvalidParameterException {
    throw new InvalidParameterException(
      messageCode.message,
      messageCode,
      details);
  }

  static InvalidParameter(paramName: string, paramValue: any, details = null): InvalidParameterException {
    const message = `The parameter '${paramName}' has an invalid value: '${paramValue}'.`;
    return new InvalidParameterException(message, Constants.ApiMessages.INVALID_PARAMETER, details);
  }

  static ThrowIf(condition: boolean, value: string, details = null) {
    if (condition) {
      const message = `Invalid parameter: ${value}`;
      throw new InvalidParameterException(
        message,
        Constants.ApiMessages.INVALID_PARAMETER,
        details);
    }
  }

  static ThrowIfNull(value: any, message: string | null = null, details = null) {
    if (value === null || value === undefined) {
      const errorMessage = message || `A required value is null or undefined.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER,
        details);
    }
  }

  static ThrowIfEmptyString(value: string, message: string | null = null, details = null) {
    if (!value || value.trim() === '') {
      const errorMessage = message || `A required string value is empty.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER,
        details);
    }
  }

  static ThrowIfGreaterThan(value: number, threshold: number, message: string | null = null, details = null) {
    if (value > threshold) {
      const errorMessage = message || `The value '${value}' exceeds the allowed threshold of '${threshold}'.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER,
        details);
    }
  }

  static ThrowIfGreaterThanOrEqual(value: number, threshold: number, message: string | null = null, details = null) {
    if (value >= threshold) {
      const errorMessage = message || `The value '${value}' meets or exceeds the allowed threshold of '${threshold}'.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER,
        details);
    }
  }

  static ThrowIfLessThan(value: number, threshold: number, message: string | null = null, details = null) {
    if (value < threshold) {
      const errorMessage = message || `The value '${value}' is below the allowed threshold of '${threshold}'.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER,
        details);
    }
  }

  static ThrowIfLessThanOrEqual(value: number, threshold: number, message: string | null = null, details = null) {
    if (value <= threshold) {
      const errorMessage = message || `The value '${value}' meets or is below the allowed threshold of '${threshold}'.`;
      throw new InvalidParameterException(
        errorMessage,
        Constants.ApiMessages.INVALID_PARAMETER,
        details);
    }
  }
}
