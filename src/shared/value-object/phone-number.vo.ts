import { isValidMobilePhone } from '@brazilian-utils/brazilian-utils';

import { InvalidFieldError } from '../error/invalid-field-error';

export class PhoneNumberVO {
  private readonly _value: string;

  constructor(number: string) {
    this._value = this.clean(number);
    this.validate();
  }

  private validate() {
    const isValid = isValidMobilePhone(this._value);
    if (!isValid) throw new InvalidFieldError('phone number');
  }

  private clean(phoneNumber: string) {
    return phoneNumber.trim().replace(/\D/g, '');
  }

  get value() {
    return this._value;
  }

  toString() {
    return this._value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
}
