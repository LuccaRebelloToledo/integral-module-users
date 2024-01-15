const statusCodes = require('node:http').STATUS_CODES;

export default class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.statusCode = statusCodes[Number(code) || 400];
    this.code = code || '400';

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
