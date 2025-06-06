import { ErrorInfo, errorMessages } from "abipulli-types";

export interface InternalErrorInfo {
  code: number;
  msg: string;
}

export class ApiError extends Error {
  public readonly code: number;
  public readonly info: string;
  public readonly resource?: string;

  constructor({ code, info, resource }: ErrorInfo) {
    super(info);
    this.code = code;
    this.info = info;
    this.resource = resource;
  }

  static internal({
    errorInfo,
  }: {
    errorInfo: InternalErrorInfo | null;
  }): ApiError {
    return new ApiError({
      code: errorInfo?.code ?? 500,
      info: errorInfo?.msg ?? "Internal Server Error",
    });
  }

  static notFound({ resource }: { resource: string }): ApiError {
    return new ApiError({
      code: 404,
      info: errorMessages.resourceNotFound,
      resource: resource,
    });
  }

  static notOwned({ resource }: { resource: string }): ApiError {
    return new ApiError({
      code: 401,
      info: errorMessages.resourceNotOwned,
      resource: resource,
    });
  }
}
