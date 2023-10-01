import { MissingParamError } from '../shared/error/missing-param-error';

import { CpfVO } from '../shared/value-object/cpf.vo';
import { EmailVO } from '../shared/value-object/email.vo';
import { PhoneNumberVO } from '../shared/value-object/phone-number.vo';
import { UniqueEntityIdVO } from '../shared/value-object/unique-entity-id.vo';
import { AddressVO, AddressType } from '../shared/value-object/address.vo';

export type CustomerType = {
  id?: string;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: AddressType;
};

export class Customer {
  constructor(
    readonly id: UniqueEntityIdVO,
    readonly cpf: CpfVO,
    readonly name: string,
    readonly email: EmailVO,
    readonly phone: PhoneNumberVO,
    readonly address: AddressVO,
    readonly createAt: Date
  ) {}

  static async create(input: CustomerType): Promise<Customer> {
    if (!input.name) throw new MissingParamError('name');

    const id = new UniqueEntityIdVO(input.id);
    const cpf = new CpfVO(input.cpf);
    const email = new EmailVO(input.email);
    const phone = new PhoneNumberVO(input.phone);

    const address = new AddressVO(
      input.address.street,
      input.address.number,
      input.address.neighborhood,
      input.address.state,
      input.address.city,
      input.address.zipcode,
      input.address.complement
    );

    return new Customer(id, cpf, input.name, email, phone, address, new Date());
  }
}
