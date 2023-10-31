import { Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import Chance from 'chance';

import { WinstonLoggerAdapter } from '../../../src/config/logger/winston';
import { ExpressAdapter } from '../../../src/infra/server/express-adapter';
import { MongoHelper } from '../../../src/infra/database/mongo-helper';

import { makeSearchController } from '../../../src/application/search/factory';
import { SearchCustomerRoute } from '../../../src/application/search/route';

import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';

const TABLE_NAME = 'customers';
const PORT = parseInt(process.env.PORT || '3000');

describe('#Route Search Route', () => {
  let mongod: MongoMemoryServer;

  const chance = Chance();
  let collection: Collection;
  const logger = new WinstonLoggerAdapter('CUSTOMER_TEST');
  const server = new ExpressAdapter(logger);
  const database = new MongoHelper();
  const controller = makeSearchController(database);

  new SearchCustomerRoute(server, controller);

  const customerId = new UniqueEntityIdVO();

  const input = {
    _id: customerId.value,
    email: chance.email(),
    cpf: chance.cpf(),
    name: chance.name(),
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

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await database.connect(uri);
    collection = await database.getCollection(TABLE_NAME);
    collection.createIndex({ '$**': 'text' });

    server.start(PORT);
  });

  beforeEach(async () => {
    const res = await collection.insertOne(input);

    console.log('Customer inserido: ', res.acknowledged);
  });

  afterEach(async () => {
    await collection.deleteMany();
  });

  afterAll(async () => {
    server.close();
    await database.disconnect();
    await mongod.stop();
  });

  it('Deve retornar 1 customer quando busca realizada por email', async () => {
    const { body } = await request(server.getApp())
      .get(`/search?search=${input.email}`)
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body[0]._id).toStrictEqual(customerId.toString());
  });

  it('Deve retornar 1 customer quando busca realizada por rua', async () => {
    const { body } = await request(server.getApp())
      .get(`/search?search=${input.address.street}`)
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body[0]._id).toStrictEqual(customerId.toString());
  });

  it('Deve retornar 1 customer quando busca realizada por bairro', async () => {
    const { body } = await request(server.getApp())
      .get(`/search?search=${input.address.neighborhood}`)
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body[0]._id).toStrictEqual(customerId.toString());
  });

  it('Deve retornar array vazio quando não encontrado registro pelo filtro informado', async () => {
    const { body } = await request(server.getApp())
      .get(`/search?search=${chance.word({ length: 8 })}`)
      .expect(200);

    expect(body).toEqual([]);
  });
});
