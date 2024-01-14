/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FindOptions } from 'mongodb';
import Chance from 'chance';
import { Logger } from '../../../src/config/logger/logger';

import CustomerRepository, {
  CustomerFilterType,
} from '../../../src/application/repository/customer-repository';
import { EventDispatcher } from '../../../src/shared/event';
import { CustomerModel } from '../../../src/application/repository/model/customer-model';
import { Create } from '../../../src/application/create/create-usecase';
import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';

import { Customer, CustomerType } from '../../../src/domain/customer-entity';

const chance = Chance();

const makeEvent = () => {
  class EventStub implements EventDispatcher{
    notify(topicArn: string, message: string): void {
      expect(topicArn).toBeDefined();
      expect(message).toBeDefined();
    }
  }

  return new EventStub();
};

const makeRepository = (input) => {
  class CustomerRepositoryStub implements CustomerRepository {
    remove(): Promise<number> {
      throw new Error('Method not implemented.');
    }

    findOneAndUpdate(): Promise<number> {
      throw new Error('Method not implemented.');
    }

    find(): Promise<CustomerModel[] | null> {
      throw new Error('Method not implemented.');
    }

    findOne(
      filter: CustomerFilterType,
      options?: FindOptions<Document> | undefined
    ): Promise<CustomerModel | null> {
      expect(options).not.toBeDefined();
      // @ts-ignore
      const [itemOne, ItemTwo] = filter.$or;

      if (
        itemOne.cpf === '04153984019' ||
        ItemTwo.email === 'joe.doe@repet.com'
      ) {
        const id = new UniqueEntityIdVO();
        return Promise.resolve({ ...input, _id: id.value });
      }

      return Promise.resolve(null);
    }

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
      console.error(message);
    }

    warn(message: string): void {
      console.warn(message);
    }
  }

  return new LoggerStub();
};

const makeSUT = () => {
  const input: CustomerType = {
    name: chance.name(),
    cpf: chance.cpf(),
    email: chance.email(),
    phone: `11 9.8224-0000`,
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

  const event = makeEvent();
  const repository = makeRepository(input);
  const logger = makeLooger();

  const sut = new Create(event, repository, logger);

  return { sut, repository, event, input };
};

describe('# Create Customer Test Integration', () => {
  it('Deve lançar exceção quando Database falhar', async () => {
    const { sut, repository, event, input } = makeSUT();

    repository.add = jest
      .fn()
      .mockRejectedValueOnce(new Error('Internal Server Error'));

    const notifySpy = jest.spyOn(event, 'notify');

    await expect(() => sut.execute(input)).rejects.toThrow(
      'Internal Server Error'
    );

    expect(notifySpy).not.toHaveBeenCalled();
  });

  it('Deve lançar exceção quando exitir customer com mesmo email', async () => {
    const { sut, event, input } = makeSUT();

    const notifySpy = jest.spyOn(event, 'notify');

    await expect(() =>
      sut.execute({
        ...input,
        cpf: '041.539.840-19',
        email: 'joe.doe@repet.com',
      })
    ).rejects.toThrow('Unprocessable Entity: found customer');

    expect(notifySpy).not.toHaveBeenCalled();
  });

  it('Deve salvar customer com sucesso', async () => {
    const { sut, event, input } = makeSUT();

    const notifySpy = jest.spyOn(event, 'notify');

    await sut.execute(input);

    expect(notifySpy).toHaveBeenCalledTimes(1);
  });
});
