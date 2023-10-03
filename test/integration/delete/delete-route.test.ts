/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import Chance from 'chance';

import { ExpressAdapter } from '../../../src/infra/server/express-adapter';
import { MongoHelper } from '../../../src/infra/database/mongo-helper';

import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';
import { WinstonLoggerAdapter } from '../../../src/config/logger/winston';

import { CustomerModel } from '../../../src/application/repository/model/customer-model';
import { makeDeleteController } from '../../../src/application/delete/factory';
import { DeleteCustomerRoute } from '../../../src/application/delete/route';

const TABLE_NAME = 'customers';
const PORT = parseInt(process.env.PORT || '3000');

describe('# Route Delete Customer', () => {
  let mongod: MongoMemoryServer;

  const chance = Chance();
  let collection: Collection;
  const logger = new WinstonLoggerAdapter('CUSTOMER_TEST');
  const server = new ExpressAdapter(logger);
  const database = new MongoHelper();
  const controller = makeDeleteController(database);

  new DeleteCustomerRoute(server, controller);

  const customerOne = {
    _id: new UniqueEntityIdVO().value,
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

  const customerTwo = {
    _id: new UniqueEntityIdVO().value,
    name: chance.name(),
    cpf: chance.cpf(),
    email: chance.email(),
    phone: `11 9.8224-7979`,
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

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await database.connect(uri);
    collection = await database.getCollection(TABLE_NAME);

    server.start(PORT);
  });

  beforeEach(async () => {
    await collection.insertMany([customerOne, customerTwo]);
  });

  afterEach(async () => {
    await collection.deleteMany();
  });

  afterAll(async () => {
    server.close();
    await database.disconnect();
    await mongod.stop();
  });

  it('Deve receber 422 quando o consumerId for invalido', async () => {
    await request(server.getApp()).delete('/customerId_invalid').expect(422);
  });

  it('Não deve deletar customer quando não encontrado id', async () => {
    const filter = new UniqueEntityIdVO();
    const { body } = await request(server.getApp())
      .delete(`/${filter.toString()}`)
      .expect(200);

    // @ts-ignore
    const customers = await collection.find({}, { _id: true }).toArray();

    expect(customers.length).toStrictEqual(2);
    expect(body).toStrictEqual({
      customerId: filter.toString(),
      message: 'Cliente não encontrado',
    });
  });

  it('Deve remover customerOne quando informando id', async () => {
    const { body } = await request(server.getApp())
      .delete(`/${customerOne._id.toString()}`)
      .expect(200);

    const result = await collection.findOne<CustomerModel>({
      _id: customerTwo._id,
    });

    expect(result?.cpf).toStrictEqual(customerTwo.cpf);
    expect(body).toEqual({
      message: 'Sucesso',
      customerId: customerOne._id.toString(),
    });
  });
});
