export class InvalidUuidError extends Error {
  constructor() {
    super('ID must be a valid ObjectId.');
    this.name = 'InvalidUuidError';
  }
}
