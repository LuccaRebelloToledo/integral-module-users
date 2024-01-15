import { Request, Response, NextFunction } from 'express';

import http from 'http';

export default function globalErrorHandler(
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  const errorData = {
    error: err,
    message: err.message,
    requestUrl: request.url,
    requestMethod: request.method,
    requestHeaders: request.headers,
    requestQuery: request.query,
    requestParams: request.params,
    requestBody: request.body,
    requestBodyStringified: JSON.stringify(request.body),
    statusCode: request.statusCode,
    statusMessage: request.statusMessage,
  };

  console.error(errorData);

  if (errorData.error instanceof Error) {
    const statusCode = Number(errorData.statusCode) || 400;

    return response.status(statusCode).json({
      statusCode: statusCode,
      error: http.STATUS_CODES[statusCode],
      message: errorData.message,
    });
  }

  return response.status(500).json({
    statusCode: 500,
    error: http.STATUS_CODES[500],
    message: 'Something is wrong',
  });
}
