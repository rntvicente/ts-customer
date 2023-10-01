import Chance from 'chance';

import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';
import { CpfVO } from '../../../src/shared/value-object/cpf.vo';
import { EmailVO } from '../../../src/shared/value-object/email.vo';
import { PhoneNumberVO } from '../../../src/shared/value-object/phone-number.vo';
import { AddressVO } from '../../../src/shared/value-object/address.vo';

import { CustomerMap } from '../../../src/shared/mapper/customer-map';
import { CustomerModel } from '../../../src/application/repository/model/customer-model';
import { Customer } from '../../../src/domain/customer-entity';

describe('# Test Unit Map Customer', () => {
  const chance = Chance();

  it('Deve retornar uma instância CustomerModel', () => {
    const id = new UniqueEntityIdVO();
    const cpf = new CpfVO(chance.cpf({ formatted: true }));
    const name = chance.name();
    const email = new EmailVO(chance.email());
    const cellphone = new PhoneNumberVO('11912349999');
    const address = new AddressVO(
      chance.street(),
      100,
      chance.province(),
      chance.state(),
      chance.city(),
      '02722-000',
      chance.word({ length: 35 })
    );

    const customerMock = new Customer(id, cpf, name, email, cellphone, address);

    const model = CustomerMap.toModel(customerMock);
    expect(model).toBeInstanceOf(CustomerModel);
  });
});
