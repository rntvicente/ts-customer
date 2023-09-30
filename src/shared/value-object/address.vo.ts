import { isValidCEP } from '@brazilian-utils/brazilian-utils';

import { MissingParamError } from '../error/missing-param-error';
import { InvalidFieldError } from '../error/invalid-field-error';

export type AddressType = {
  street: string;
  number: number;
  neighborhood: string;
  state: string;
  city: string;
  zipcode: string;
  complement?: string;
};

export class AddressVO {
  private readonly _street: string;
  private readonly _number: number;
  private readonly _neighborhood: string;
  private readonly _state: string;
  private readonly _city: string;
  private readonly _zipcode: string;
  private readonly _complement: string | undefined;

  constructor(
    street: string,
    number: number,
    neighborhood: string,
    state: string,
    city: string,
    zipcode: string,
    complement?: string
  ) {
    this._street = street;
    this._number = number;
    this._neighborhood = neighborhood;
    this._state = state;
    this._city = city;
    this._zipcode = zipcode;
    this._complement = complement;

    this.validate();
  }

  private validate() {
    if (!this._street || !this._street.trim())
      throw new MissingParamError('street');

    if (!this._number || this._number <= 0)
      throw new InvalidFieldError('number');

    if (!this._neighborhood || !this._neighborhood.trim())
      throw new MissingParamError('neighborhood');

    if (!this._state || !this._state.trim())
      throw new MissingParamError('state');

    if (!this._city || !this._city.trim()) throw new MissingParamError('city');

    if (!isValidCEP(this._zipcode)) throw new InvalidFieldError('zipcode');
  }

  get street() {
    return this._street;
  }

  get number() {
    return this._number;
  }

  get complement() {
    return this._complement;
  }

  get neighborhood() {
    return this._neighborhood;
  }

  get zipcode() {
    return this._zipcode;
  }

  get state() {
    return this._state;
  }

  get city() {
    return this._city;
  }

  toString() {
    return `${this._street}, ${this._number}${
      this._complement ? `, ${this.complement}` : ''
    }, ${this._neighborhood} - ${this._zipcode}, ${this._state} - ${
      this._city
    }`;
  }
}
