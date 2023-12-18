export class InternalServerError extends Error {
  constructor(message: string) {
    super(`Internal Server Error: ${message}`);
    this.name = 'InternalServerError';
  }
}
