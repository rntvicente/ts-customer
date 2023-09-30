import { isValidCPF, formatCPF } from '@brazilian-utils/brazilian-utils';

import { InvalidFieldError } from '../error/invalid-field-error';

export class CpfVO {
  private readonly _cpf: string;

  constructor(cpf: string) {
    this._cpf = this.clean(cpf);
    this.validate();
  }

  private validate() {
    const isValid = isValidCPF(this._cpf);

    if (!isValid) throw new InvalidFieldError('cpf');
  }

  private clean(cpf: string) {
    return cpf.replace(/\D/g, '');
  }

  get value() {
    return this._cpf;
  }

  toString() {
    return formatCPF(this._cpf, { pad: true });
  }
}
