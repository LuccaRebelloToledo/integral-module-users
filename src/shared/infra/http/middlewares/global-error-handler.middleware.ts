import { Request, Response, NextFunction } from 'express';

import http from 'http';

import AppError from '@shared/errors/app-error';

import { isCelebrateError } from 'celebrate';

import EscapeHtml from 'escape-html';

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

  if (isCelebrateError(err)) {
    const validation: Record<string, unknown> = {};

    for (const [segment, joiError] of err.details.entries()) {
      validation[segment] = {
        source: segment,
        keys: JSON.stringify(
          joiError.details.map((detail) => EscapeHtml(detail.path.join('.'))),
        ),
        message: joiError.message,
      };
    }

    return response.status(400).json({
      statusCode: 400,
      error: http.STATUS_CODES[400],
      message: err.message,
      validation,
    });
  }

  if (err instanceof AppError) {
    const statusCode = Number(err.statusCode) || 400;

    return response.status(statusCode).json({
      statusCode: statusCode,
      error: http.STATUS_CODES[statusCode],
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return response.status(400).json({
      statusCode: 400,
      error: http.STATUS_CODES[400],
      message: err.message,
    });
  }

  return response.status(500).json({
    statusCode: 500,
    error: http.STATUS_CODES[500],
    message: 'Something is wrong',
  });
}
