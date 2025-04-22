import { errorMessages, type ErrorInfo } from "./errorMessages";

interface ApiErrorParams {
  code: number;
  info: ErrorInfo;
  resource?: string;
}

class ApiError {
  code: number;
  info: ErrorInfo;
  resource?: string;

  constructor({ code, info, resource }: ApiErrorParams) {
    this.code = code;
    this.info = info;
    this.resource = resource;
  }

  static badRequest(errorInfo: ErrorInfo) {
    return new ApiError({ code: 400, info: errorInfo });
  }

  static internal(errorInfo: ErrorInfo) {
    return new ApiError({ code: 500, info: errorInfo });
  }

  static notFound(resource: string) {
    return new ApiError({
      code: 404,
      info: errorMessages.resourceNotFound,
      resource,
    });
  }
}

export default ApiError;
