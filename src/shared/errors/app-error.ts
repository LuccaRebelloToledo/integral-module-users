import { BAD_REQUEST } from '@shared/infra/http/constants/http-status-code.constants';

export default class AppError extends Error {
  public readonly appErrorType: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    appErrorType: string,
    statusCode = BAD_REQUEST,
    isOperational = true,
  ) {
    super();

    this.name = `Error: ${appErrorType}`;
    this.message = this.message ? this.message : appErrorType;
    this.statusCode = statusCode;
    this.appErrorType = appErrorType;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
