export class UnprocessableEntityError extends Error {
  constructor(message: string) {
    super(`Unprocessable Entity: ${message}`);
    this.name = 'UnprocessableEntityError';
  }
}
