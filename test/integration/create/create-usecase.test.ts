import Chance from 'chance';
import { Logger } from '../../../src/config/logger/logger';

import CustomerRepository from '../../../src/application/repository/customer-repository';
import { Create } from '../../../src/application/create/create-usecase';
import { Customer, CustomerType } from '../../../src/domain/customer-entity';

const chance = Chance();

const makeRepository = () => {
  class CustomerRepositoryStub implements CustomerRepository {
    async add(customer: Customer): Promise<void> {
      expect(customer.id).toBeDefined();
    }
  }

  return new CustomerRepositoryStub();
};

const makeLooger = () => {
  class LoggerStub implements Logger {
    info(message: string): void {
      console.info(message);
    }
    error(message: string): void {
      throw new Error('Method not implemented.');
    }
    warn(message: string): void {
      throw new Error('Method not implemented.');
    }
  }

  return new LoggerStub();
};

const makeSUT = () => {
  const repository = makeRepository();
  const logger = makeLooger();

  const sut = new Create(repository, logger);

  return { sut, repository };
};

describe('# Create Customer Test Integration', () => {
  const input: CustomerType = {
    name: chance.name(),
    cpf: chance.cpf(),
    email: chance.email(),
    phone: `11 9.8224-7878`,
    address: {
      city: chance.city(),
      state: chance.state(),
      street: chance.street(),
      neighborhood: chance.province({ full: true }),
      zipcode: `${chance.zip()}-000`,
      number: 100,
      complement: chance.word({ length: 15 }),
    },
  };

  it('Deve salvar customer com sucesso', async () => {
    const { sut } = makeSUT();
    await sut.execute(input);
  });

  it('Deve lançar exceção quando Database falhar', async () => {
    const { sut, repository } = makeSUT();
    repository.add = jest.fn().mockRejectedValueOnce(new Error('Internal Server Error'));

    await expect(() => sut.execute(input)).rejects.toThrow('Internal Server Error');    
  });
});
