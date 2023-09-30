import { randomUUID } from 'crypto';

export class UniqueEntityIdVO {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value || randomUUID();
  }

  get value() {
    return this._value;
  }
}
