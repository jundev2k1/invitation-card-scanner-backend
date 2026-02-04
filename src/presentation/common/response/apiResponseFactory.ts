import { ApiMessages } from "src/common/constants/api-messages";
import { ApiResponse } from "./apiResponse";

export class ApiResponseFactory<T> {
  constructor(
    public readonly data: T,
    public readonly message: string = ApiMessages.SUCCESS,
    public readonly statusCode: number = 200,
  ) { }

  static success<T>(
    data: T,
    message: string = ApiMessages.SUCCESS,
    statusCode: number = 200
  ): ApiResponse<T> {
    return new ApiResponse<T>(data, statusCode, message);
  }

  static created<T>(
    data: T,
    message: string = ApiMessages.CREATED,
  ): ApiResponse<T> {
    return new ApiResponse<T>(data, 201, message);
  }

  static noContent(message: string = ApiMessages.SUCCESS): ApiResponse<null> {
    return new ApiResponse<null>(null, 200, message);
  }

  static error<T>(
    data: T,
    message: string = ApiMessages.SYSTEM_ERROR,
    statusCode: number = 500
  ): ApiResponse<T> {
    return new ApiResponse<T>(data, statusCode, message);
  }
}
