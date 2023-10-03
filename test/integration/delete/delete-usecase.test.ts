import { FindOptions, ObjectId } from 'mongodb';

import { Logger } from '../../../src/config/logger/logger';
import CustomerRepository, {
  CustomerFilterType,
  CustomerUpdate,
} from '../../../src/application/repository/customer-repository';
import { CustomerModel } from '../../../src/application/repository/model/customer-model';

import { Delete } from '../../../src/application/delete/delete-usecase';
import { Customer } from '../../../src/domain/customer-entity';

import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';
import { CustomerMap } from 'shared/mapper/customer-map';

const makeRepository = (customerIdParam) => {
  class CustomerRepositoryStub implements CustomerRepository {
    add(customer: Customer): Promise<void> {
      throw new Error('Method not implemented.');
    }
    remove(customerId: ObjectId): Promise<number> {
      expect(customerId).toStrictEqual(customerIdParam);
      return Promise.resolve(1);
    }
    findOneAndUpdate(
      filter: CustomerFilterType,
      data: CustomerUpdate
    ): Promise<number> {
      throw new Error('Method not implemented.');
    }
    findOne(
      filter: CustomerFilterType,
      options?: FindOptions<Document> | undefined
    ): Promise<CustomerModel | null> {
      throw new Error('Method not implemented.');
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
  const customerId = new UniqueEntityIdVO();
  const repository = makeRepository(customerId.value);
  const logger = makeLooger();
  const sut = new Delete(repository, logger);

  return { sut, repository, logger, customerId };
};

describe('# Delete Customer Test Integration', () => {
  it('Deve lançar exceção quando Database falhar', async () => {
    const { repository, sut, customerId } = makeSUT();

    repository.remove = jest
      .fn()
      .mockRejectedValueOnce(new Error('Internal Server Error'));

    await expect(() => sut.execute(customerId.toString())).rejects.toThrow(
      'Internal Server Error'
    );
  });

  it('Não deve deletar customer quando customerId não encontrado', async () => {
    const { repository, sut, customerId, logger } = makeSUT();

    repository.remove = jest.fn().mockResolvedValueOnce(0);
    const infoSpy = jest.spyOn(logger, 'info');

    await sut.execute(customerId.toString());

    expect(infoSpy).lastCalledWith(
      `[USE CASE] not found customer ${customerId.toString()}`
    );
  });

  it('Deve deletar o registro quando encontrado customerId', async () => {
    const { sut, customerId } = makeSUT();
    await sut.execute(customerId.toString());
  })
});
