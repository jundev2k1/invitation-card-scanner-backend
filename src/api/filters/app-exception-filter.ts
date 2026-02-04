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
  log: string;
};

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { status, messageCode, message, log } = this.getError(exception);

    console.error(`[${request.method}] ${request.url} - ${log}`);

    const errorRes = ApiResponseFactory.error(
      { code: messageCode, message: message },
      status
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
        log: badRequest.message || badRequest.code.message,
      }
    }
    if (ex instanceof ForbiddenException) {
      const forbidden = ex as ForbiddenException;
      return {
        status: forbidden.status,
        messageCode: forbidden.code.code,
        message: forbidden.code.message,
        log: forbidden.message || forbidden.code.message,
      }
    }
    if (ex instanceof UnauthorizedException) {
      const unauthorized = ex as UnauthorizedException;
      return {
        status: unauthorized.status,
        messageCode: unauthorized.code.code,
        message: unauthorized.code.message,
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
        log: bussinessRuleEx.message || bussinessRuleEx.code.message,
      }
    }
    if (ex instanceof InvalidFormatException) {
      const invalidFormatEx = ex as InvalidFormatException;
      return {
        status: invalidFormatEx.status,
        messageCode: invalidFormatEx.code.code,
        message: invalidFormatEx.code.message,
        log: invalidFormatEx.message || invalidFormatEx.code.message,
      }
    }
    if (ex instanceof InvalidParameterException) {
      const invalidParameterEx = ex as InvalidParameterException;
      return {
        status: invalidParameterEx.status,
        messageCode: invalidParameterEx.code.code,
        message: invalidParameterEx.code.message,
        log: invalidParameterEx.message || invalidParameterEx.code.message,
      }
    }
    if (ex instanceof NotFoundException) {
      const notFoundEx = ex as NotFoundException;
      return {
        status: notFoundEx.status,
        messageCode: notFoundEx.code.code,
        message: notFoundEx.code.message,
        log: notFoundEx.message || notFoundEx.code.message,
      }
    }

    // Fallback for unhandled exceptions
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messageCode: Constants.ApiMessages.SYSTEM_ERROR.code,
      message: Constants.ApiMessages.SYSTEM_ERROR.message,
      log: ex.stack || ex.message || 'No stack trace available',
    };
  }
}