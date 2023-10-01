import Chance from 'chance';

import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';
import { CpfVO } from '../../../src/shared/value-object/cpf.vo';
import { EmailVO } from '../../../src/shared/value-object/email.vo';
import { PhoneNumberVO } from '../../../src/shared/value-object/phone-number.vo';
import { AddressVO } from '../../../src/shared/value-object/address.vo';

import { CustomerMap } from '../../../src/shared/mapper/customer-map';
import { CustomerModel } from '../../../src/application/repository/model/customer-model';
import { Customer } from '../../../src/domain/customer-entity';
import { ObjectId } from 'mongodb';

describe('# Test Unit Map Customer', () => {
  const chance = Chance();

  const address = new AddressVO(
    chance.street(),
    100,
    chance.province(),
    chance.state(),
    chance.city(),
    '02722-000',
    chance.word({ length: 35 })
  );

  it('Deve retornar uma instância CustomerModel', () => {
    const id = new UniqueEntityIdVO();
    const cpf = new CpfVO(chance.cpf({ formatted: true }));
    const name = chance.name();
    const email = new EmailVO(chance.email());
    const cellphone = new PhoneNumberVO('11912349999');

    const entity = new Customer(
      id,
      cpf,
      name,
      email,
      cellphone,
      address,
      chance.date()
    );

    const model = CustomerMap.toModel(entity);
    expect(model).toBeInstanceOf(CustomerModel);
  });

  it('Deve retornar uma instância de Customer Entity', () => {
    const model = new CustomerModel(
      chance.cpf(),
      chance.name(),
      chance.email(),
      '11912349999',
      address,
      chance.date(),
      new ObjectId()
    );

    const entity = CustomerMap.toEntity(model);
    expect(entity).toBeInstanceOf(Customer);
  });
});
