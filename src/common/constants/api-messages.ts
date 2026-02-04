export class ApiMessages {
  static readonly SYSTEM_ERROR = 'A system error has occurred. Please try again later.';
  static readonly SUCCESS = 'Request processed successfully.';
  static readonly CREATED = 'Resource created successfully.';
  static readonly UPDATED = 'Resource updated successfully.';
  static readonly DELETED = 'Resource deleted successfully.';
  static readonly UNAUTHORIZED = 'You are not authorized to perform this action.';
  static readonly FORBIDDEN = 'Access to this resource is forbidden.';
  static readonly INVALID_STATE = 'The request is in an invalid state.';
  static readonly NOT_FOUND = 'The requested resource was not found.';
  static readonly VALIDATION_ERROR = 'One or more validation errors occurred.';
  static readonly SERVER_ERROR = 'An unexpected error occurred on the server.';
}