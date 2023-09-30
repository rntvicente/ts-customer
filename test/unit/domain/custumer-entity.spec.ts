import Chance from 'chance';

import { Customer, CustomerType } from '../../../src/domain/customer-entity';
import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';

describe('# Customer Test Unit', () => {
  const chance = Chance();
  let input: CustomerType;

  beforeEach(() => {
    input = {
      cpf: chance.cpf({ formatted: true }),
      name: chance.name(),
      email: chance.email(),
      phone: '(11) 98224-8899',
      address: {
        street: chance.street(),
        number: 10,
        neighborhood: chance.animal(),
        state: chance.state(),
        city: chance.city(),
        zipcode: '02722000',
      },
    };
  });

  it('Deve lançar exceção quando campo name for vazio', async () => {
    input.name = '';

    await expect(() => Customer.create(input)).rejects.toThrow(
      new Error('Missing Param: name.')
    );
  });

  it('Deve lançar exceção quando email for vazio', async () => {
    input.email = '';

    await expect(() => Customer.create(input)).rejects.toThrow(
      new Error('Invalid Field: e-mail.')
    );
  });

  it('Deve lançar exceção quando CPF for vazio', async () => {
    input.cpf = '';

    await expect(() => Customer.create(input)).rejects.toThrow(
      new Error('Invalid Field: cpf.')
    );
  });

  it('Deve lançar exceção quando phone for vazio', async () => {
    input.phone = '';

    await expect(() => Customer.create(input)).rejects.toThrow(
      new Error('Invalid Field: phone number.')
    );
  });

  it('Deve lançar exceção quando Address for vazio', async () => {
    input.address.street = '';

    await expect(() => Customer.create(input)).rejects.toThrow(
      new Error('Missing Param: street.')
    );
  });

  it('Deve criar uma instância de Customer', async () => {
    let customer = await Customer.create(input);

    expect(customer).toBeInstanceOf(Customer);

    expect(customer.id).toBeDefined();
    expect(customer.name).toStrictEqual(input.name);
    expect(customer.email.value).toStrictEqual(input.email);
    expect(customer.cpf.toString()).toStrictEqual(input.cpf);
    expect(customer.phone.toString()).toStrictEqual(input.phone);

    const generetedId = new UniqueEntityIdVO();

    customer = await Customer.create({
      ...input,
      id: generetedId.value,
    });

    expect(customer.id).toStrictEqual(generetedId);
  });
});
