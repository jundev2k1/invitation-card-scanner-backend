import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Constants } from 'src/common';
import { ApiResponseFactory } from '../common';
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException
} from 'src/application/common/exceptions';
import {
  BussinessRuleViolationException,
  InvalidFormatException,
  InvalidParameterException,
  NotFoundException
} from 'src/domain/exceptions';

type ErrorResponse = {
  status: number;
  messageCode: string;
  message: string;
  details: any,
  log: string;
};

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { status, messageCode, message, details, log } = this.getError(exception);

    console.error(`[${request.method}] ${request.url} - ${log}`);

    const errorRes = ApiResponseFactory.error(
      { code: messageCode, message: message },
      status,
      details
    );
    return response.status(status).json(errorRes);
  }

  getError(ex: Error): ErrorResponse {
    // Handle for Application Exceptions
    if (ex instanceof BadRequestException) {
      const badRequest = ex as BadRequestException;
      return {
        status: badRequest.status,
        messageCode: badRequest.code.code,
        message: badRequest.code.message,
        details: badRequest.errorDetails,
        log: badRequest.message || badRequest.code.message,
      }
    }
    if (ex instanceof ForbiddenException) {
      const forbidden = ex as ForbiddenException;
      return {
        status: forbidden.status,
        messageCode: forbidden.code.code,
        message: forbidden.code.message,
        details: forbidden.errorDetails,
        log: forbidden.message || forbidden.code.message,
      }
    }
    if (ex instanceof UnauthorizedException) {
      const unauthorized = ex as UnauthorizedException;
      return {
        status: unauthorized.status,
        messageCode: unauthorized.code.code,
        message: unauthorized.code.message,
        details: unauthorized.errorDetails,
        log: unauthorized.message || unauthorized.code.message,
      }
    }

    // Handle for Domain Exceptions
    if (ex instanceof BussinessRuleViolationException) {
      const bussinessRuleEx = ex as BussinessRuleViolationException;
      return {
        status: bussinessRuleEx.status,
        messageCode: bussinessRuleEx.code.code,
        message: bussinessRuleEx.code.message,
        details: bussinessRuleEx.errorDetails,
        log: bussinessRuleEx.message || bussinessRuleEx.code.message,
      }
    }
    if (ex instanceof InvalidFormatException) {
      const invalidFormatEx = ex as InvalidFormatException;
      return {
        status: invalidFormatEx.status,
        messageCode: invalidFormatEx.code.code,
        message: invalidFormatEx.code.message,
        details: invalidFormatEx.errorDetails,
        log: invalidFormatEx.message || invalidFormatEx.code.message,
      }
    }
    if (ex instanceof InvalidParameterException) {
      const invalidParameterEx = ex as InvalidParameterException;
      return {
        status: invalidParameterEx.status,
        messageCode: invalidParameterEx.code.code,
        message: invalidParameterEx.code.message,
        details: invalidParameterEx.errorDetails,
        log: invalidParameterEx.message || invalidParameterEx.code.message,
      }
    }
    if (ex instanceof NotFoundException) {
      const notFoundEx = ex as NotFoundException;
      return {
        status: notFoundEx.status,
        messageCode: notFoundEx.code.code,
        message: notFoundEx.code.message,
        details: notFoundEx.errorDetails,
        log: notFoundEx.message || notFoundEx.code.message,
      }
    }

    // Fallback for unhandled exceptions
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messageCode: Constants.ApiMessages.SYSTEM_ERROR.code,
      message: Constants.ApiMessages.SYSTEM_ERROR.message,
      details: null,
      log: ex.stack || ex.message || 'No stack trace available',
    };
  }
}