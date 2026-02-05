import { Constants } from "src/common";
import { ApiMessageDetail } from "src/common/constants";
import { ApiResponse } from "./apiResponse";

export class ApiResponseFactory {
  static ok<T>(
    data: T,
    message: ApiMessageDetail = Constants.ApiMessages.SUCCESS,
    statusCode: number = 200
  ): ApiResponse<T> {
    return new ApiResponse<T>(data, statusCode, message.code, message.message);
  }

  static created<T>(
    data: T | null = null,
    message: ApiMessageDetail = Constants.ApiMessages.CREATED,
  ): ApiResponse<T | null> {
    return new ApiResponse<T | null>(data, 201, message.code, message.message);
  }

  static noContent(message: ApiMessageDetail = Constants.ApiMessages.SUCCESS): ApiResponse<null> {
    return new ApiResponse<null>(null, 200, message.code, message.message);
  }

  static error(
    message: ApiMessageDetail = Constants.ApiMessages.SYSTEM_ERROR,
    statusCode: number = 500,
    errorDetails = null
  ): ApiResponse<undefined> {
    return new ApiResponse<undefined>(undefined, statusCode, message.code, message.message, errorDetails);
  }
}
