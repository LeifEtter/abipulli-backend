interface ApiErrorParams {
  code: number;
  message: string;
}

class ApiError {
  code: number;
  message: string;

  constructor({ code, message }: ApiErrorParams) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg: string) {
    return new ApiError({ code: 400, message: msg });
  }

  static internal(msg: string) {
    return new ApiError({ code: 500, message: msg });
  }
}

export default ApiError;
