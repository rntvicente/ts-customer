export class BadRequestError extends Error {
  constructor(message: string) {
    super(`Bad Request: ${message}`);
    this.name = 'BadRequestError';
  }
}
