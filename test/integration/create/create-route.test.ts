import { Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import Chance from 'chance';

import { ExpressAdapter } from '../../../src/infra/server/express-adapter';
import { WinstonLoggerAdapter } from '../../../src/config/logger/winston';
import { MongoHelper } from '../../../src/infra/database/mongo-helper';

import { makeCreateController } from '../../../src/application/create/factory';
import { CreateCustomerRoute } from '../../../src/application/create';

const TABLE_NAME = 'customers';

describe('# Route Create Customer', () => {
  let mongod: MongoMemoryServer;

  const chance = Chance();
  let collection: Collection;
  const logger = new WinstonLoggerAdapter('JEST CREATE CUSTOMER');
  const server = new ExpressAdapter(logger);
  const database = new MongoHelper();
  const controller = makeCreateController(database);

  new CreateCustomerRoute(server, controller);

  const input = {
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

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await database.connect(uri);
    collection = await database.getCollection(TABLE_NAME);

    server.start(process.env.PORT);
  });

  afterEach(async () => {
    await collection.deleteMany();
  });

  afterAll(async () => {
    server.close();
    await database.disconnect();
    await mongod.stop();
  });

  it('Deve inserir um novo customer quando chamado a rota POST', async () => {
    const { body } = await request(server.getApp())
      .post('/')
      .send(input)
      .expect(201);

    const inserted = await collection.findOne({ email: input.email });

    expect(body).toEqual({
      message: 'Sucesso',
      customerId: inserted?._id.toString(),
    });
  });

  it('Deve receber 422 quando uma exceção for lançada', async () => {
    await request(server.getApp())
      .post('/')
      .send({ ...input, cpf: '111.111.111-11' })
      .expect(422);
  });
});
