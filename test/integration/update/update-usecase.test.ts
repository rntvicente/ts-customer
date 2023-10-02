import { FindOptions, ObjectId } from 'mongodb';
import Chance from 'chance';

import { Logger } from '../../../src/config/logger/logger';
import CustomerRepository, {
  CustomerFilterType,
  CustomerUpdate,
} from '../../../src/application/repository/customer-repository';
import { CustomerModel } from '../../../src/application/repository/model/customer-model';

import { Update } from '../../../src/application/update/update-usecase';
import { Customer } from '../../../src/domain/customer-entity';

import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';

const makeRepository = (customerId, document) => {
  class CustomerRepositoryStub implements CustomerRepository {
    add(customer: Customer): Promise<void> {
      throw new Error('Method not implemented.');
    }

    findOne(
      filter: CustomerFilterType,
      options?: FindOptions<Document> | undefined
    ): Promise<CustomerModel | null> {
      throw new Error('Method not implemented.');
    }

    async findOneAndUpdate(
      filter: CustomerFilterType,
      data: CustomerUpdate
    ): Promise<number> {
      expect(filter).toEqual({ _id: customerId.value });
      expect(data).toEqual(document);
      return 1;
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
  const chance = Chance();

  const customerId = new UniqueEntityIdVO();
  const document = {
    phone: '11982240000',
    name: chance.name(),
    address: {
      street: chance.street(),
      number: 100,
      neighborhood: chance.province(),
      state: chance.state(),
      city: chance.city(),
      zipcode: `${chance.zip()}-000`,
      complement: chance.word({ length: 35 }),
    },
  };
  const repository = makeRepository(customerId, document);
  const logger = makeLooger();
  const sut = new Update(repository, logger);

  return { sut, repository, logger, document, customerId };
};

describe('# Update Customer Test Integration', () => {
  it('Deve lançar exceção quando Database falhar', async () => {
    const { repository, sut, customerId, document } = makeSUT();

    repository.findOneAndUpdate = jest
      .fn()
      .mockRejectedValueOnce(new Error('Internal Server Error'));

    await expect(() =>
      sut.execute({ customerId: customerId.toString(), document })
    ).rejects.toThrow('Internal Server Error');
  });

  it('Não deve atualizar customer quando não encontrar registro', async () => {
    const { repository, sut, logger, customerId, document } = makeSUT();
    const infoSpy = jest.spyOn(logger, 'info');

    repository.findOneAndUpdate = jest.fn().mockResolvedValueOnce(0);

    await sut.execute({ customerId: customerId.toString(), document });

    expect(infoSpy).lastCalledWith(
      `[USE CASE] customer ${customerId.toString()} not found`
    );
  });

  it('Deve atualziar corretamente quando encontrado customer', async () => {
    const { sut, logger, customerId, document } = makeSUT();
    const infoSpy = jest.spyOn(logger, 'info');

    await sut.execute({ customerId: customerId.toString(), document });

    expect(infoSpy).lastCalledWith(
      `[USE CASE] customer saved successfully ID ${customerId.toString()}`
    );
  });
});
