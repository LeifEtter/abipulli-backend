import type { ErrorInfo } from "./errorMessages";

interface ApiErrorParams {
  code: number;
  info: ErrorInfo;
}

class ApiError {
  code: number;
  info: ErrorInfo;

  constructor({ code, info }: ApiErrorParams) {
    this.code = code;
    this.info = info;
  }

  static badRequest(errorInfo: ErrorInfo) {
    return new ApiError({ code: 400, info: errorInfo });
  }

  static internal(errorInfo: ErrorInfo) {
    return new ApiError({ code: 500, info: errorInfo });
  }
}

export default ApiError;
