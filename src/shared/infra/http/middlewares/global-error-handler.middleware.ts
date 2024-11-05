import type { NextFunction, Request, Response } from 'express';

import * as Sentry from '@sentry/node';

import http from 'node:http';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from '../constants/http-status-code.constants';

import AppError from '@shared/errors/app-error';
import { isCelebrateError } from 'celebrate';
import { JsonWebTokenError } from 'jsonwebtoken';

export default function globalErrorHandler(
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
): Response {
  console.error(err);

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

  try {
    decodeURIComponent(request.path);

    if (isCelebrateError(err)) {
      const entry = err.details.entries().next().value;
      const joiError = entry ? entry[1].details[0].message : err.message;

      return response.status(BAD_REQUEST).json({
        statusCode: BAD_REQUEST,
        error: http.STATUS_CODES[BAD_REQUEST],
        message: joiError,
      });
    }

    if (err instanceof AppError) {
      const statusCode = Number(err.statusCode);

      return response.status(statusCode).json({
        statusCode,
        error: http.STATUS_CODES[statusCode],
        message: err.message,
      });
    }

    if (err instanceof JsonWebTokenError) {
      const statusCode = UNAUTHORIZED;

      return response.status(statusCode).json({
        statusCode,
        error: http.STATUS_CODES[statusCode],
        message: err.message,
      });
    }

    Sentry.captureException(err, {
      extra: errorData,
    });

    return response.status(INTERNAL_SERVER_ERROR).json({
      statusCode: INTERNAL_SERVER_ERROR,
      error: http.STATUS_CODES[INTERNAL_SERVER_ERROR],
      message: 'Something is wrong!',
    });
  } catch (err) {
    if (err instanceof URIError) {
      return response.status(BAD_REQUEST).json({
        statusCode: BAD_REQUEST,
        error: http.STATUS_CODES[BAD_REQUEST],
        message: 'Malformed URI. Please check the URL and try again.',
      });
    }

    Sentry.captureException(err, {
      extra: errorData,
    });

    return response.status(INTERNAL_SERVER_ERROR).json({
      statusCode: INTERNAL_SERVER_ERROR,
      error: http.STATUS_CODES[INTERNAL_SERVER_ERROR],
      message: 'Something is wrong!',
    });
  }
}
