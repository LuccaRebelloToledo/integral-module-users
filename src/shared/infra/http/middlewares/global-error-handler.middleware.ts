import { Request, Response } from 'express';

import http from 'http';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '../constants/http-status-code.constants';

import AppError from '@shared/errors/app-error';

import { isCelebrateError } from 'celebrate';

import EscapeHtml from 'escape-html';

export default function globalErrorHandler(
  err: Error,
  request: Request,
  response: Response,
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

    return response.status(BAD_REQUEST).json({
      statusCode: BAD_REQUEST,
      error: http.STATUS_CODES[BAD_REQUEST],
      message: err.message,
      validation,
    });
  }

  if (err instanceof AppError) {
    const statusCode = Number(err.statusCode);

    return response.status(statusCode).json({
      statusCode: statusCode,
      error: http.STATUS_CODES[statusCode],
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return response.status(BAD_REQUEST).json({
      statusCode: BAD_REQUEST,
      error: http.STATUS_CODES[BAD_REQUEST],
      message: err.message,
    });
  }

  return response.status(INTERNAL_SERVER_ERROR).json({
    statusCode: INTERNAL_SERVER_ERROR,
    error: http.STATUS_CODES[INTERNAL_SERVER_ERROR],
    message: 'Something is wrong',
  });
}
