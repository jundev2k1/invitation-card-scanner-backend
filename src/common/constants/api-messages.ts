export class ApiMessageDetail {
  constructor(public readonly code: string, public readonly message: string) { }
}

export class ApiMessages {
  // System Errors
  static readonly SYSTEM_ERROR = new ApiMessageDetail('001', 'A system error has occurred. Please try again later.');
  static readonly UNAUTHORIZED = new ApiMessageDetail('002', 'You are not authorized to perform this action.');
  static readonly FORBIDDEN = new ApiMessageDetail('003', 'Access to this resource is forbidden.');
  static readonly NOT_FOUND = new ApiMessageDetail('004', 'The requested resource was not found.');
  static readonly CONFLICT = new ApiMessageDetail('005', 'The request could not be completed due to a conflict with the current state of the resource.');
  static readonly RATE_LIMIT_EXCEEDED = new ApiMessageDetail('006', 'Rate limit exceeded. Please try again later.');
  static readonly DEPENDENCY_FAILURE = new ApiMessageDetail('007', 'A dependent service failed to respond correctly.');
  static readonly BUSSINESS_RULE_VIOLATION = new ApiMessageDetail('008', 'The request violates a business rule.');
  static readonly VALIDATION_ERROR = new ApiMessageDetail('009', 'One or more validation errors occurred.');
  static readonly INVALID_STATE = new ApiMessageDetail('010', 'The request is in an invalid state.');
  static readonly INVALID_PARAMETER = new ApiMessageDetail('011', 'One or more parameters are invalid.');
  static readonly INVALID_FORMAT = new ApiMessageDetail('012', 'The format of the provided data is invalid.');
  static readonly INVALID_VALUE = new ApiMessageDetail('013', 'The value provided is invalid.');
  static readonly INVALID_EMAIL_FORMAT = new ApiMessageDetail('014', 'The email format provided is invalid.');
  static readonly INVALID_PHONE_FORMAT = new ApiMessageDetail('015', 'The phone number format provided is invalid.');
  static readonly INVALID_DATE_FORMAT = new ApiMessageDetail('016', 'The date format provided is invalid.');
  static readonly MISSING_REQUIRED_FIELD = new ApiMessageDetail('017', 'A required field is missing from the request.');
  static readonly TIMEOUT = new ApiMessageDetail('018', 'The request timed out. Please try again later.');
  static readonly UNSUPPORTED_MEDIA_TYPE = new ApiMessageDetail('019', 'The media type of the request is unsupported.');
  static readonly UNSUPPORTED_OPERATION = new ApiMessageDetail('020', 'The requested operation is not supported.');
  // System Successes
  static readonly SUCCESS = new ApiMessageDetail('050', 'Request processed successfully.');
  static readonly CREATED = new ApiMessageDetail('051', 'Resource created successfully.');
  static readonly UPDATED = new ApiMessageDetail('052', 'Resource updated successfully.');
  static readonly DELETED = new ApiMessageDetail('053', 'Resource deleted successfully.');

  // Auth Errors
  static readonly INVALID_CREDENTIALS = new ApiMessageDetail('100', 'The provided credentials are invalid.')
  static readonly TOKEN_EXPIRED = new ApiMessageDetail('101', 'The authentication token has expired.');
  static readonly TOKEN_INVALID = new ApiMessageDetail('102', 'The authentication token is invalid.');
  static readonly USER_DISABLED = new ApiMessageDetail('103', 'The user account is disabled.');

  // Auth Successes
  static readonly LOGIN_SUCCESS = new ApiMessageDetail('150', 'Login successful.');
  static readonly LOGOUT_SUCCESS = new ApiMessageDetail('151', 'Logout successful.');

  // User Errors
  static readonly USER_ALREADY_EXISTS = new ApiMessageDetail('200', 'A user with the given identifier already exists.');
  static readonly USER_NOT_FOUND = new ApiMessageDetail('201', 'The specified user was not found.');
  static readonly USER_LOCKED = new ApiMessageDetail('202', 'The user account is currently locked or banned.');
  static readonly USER_NOT_APPROVED = new ApiMessageDetail('203', 'The user account is pending approval and cannot access the system yet.');
}
