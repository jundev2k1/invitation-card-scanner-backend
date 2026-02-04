import { Constants } from "src/common";
import { ApiResponse } from "./apiResponse";
import { ApiMessageDetail } from "src/common/constants";

export class ApiResponseFactory {
  static success<T>(
    data: T,
    message: ApiMessageDetail = Constants.ApiMessages.SUCCESS,
    statusCode: number = 200
  ): ApiResponse<T> {
    return new ApiResponse<T>(data, statusCode, message.code, message.message);
  }

  static created<T>(
    data: T,
    message: ApiMessageDetail = Constants.ApiMessages.CREATED,
  ): ApiResponse<T> {
    return new ApiResponse<T>(data, 201, message.code, message.message);
  }

  static noContent(message: ApiMessageDetail = Constants.ApiMessages.SUCCESS): ApiResponse<null> {
    return new ApiResponse<null>(null, 200, message.code, message.message);
  }

  static error<T>(
    data: T,
    message: ApiMessageDetail = Constants.ApiMessages.SYSTEM_ERROR,
    statusCode: number = 500
  ): ApiResponse<T> {
    return new ApiResponse<T>(data, statusCode, message.code, message.message);
  }
}
