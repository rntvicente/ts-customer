import { Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import Chance from 'chance';

import { ExpressAdapter } from '../../../src/infra/server/express-adapter';
import { WinstonLoggerAdapter } from '../../../src/config/logger/winston';
import { MongoHelper } from '../../../src/infra/database/mongo-helper';

import { makeCreateController } from '../../../src/application/create/factory';
import { CreateCustomerRoute } from '../../../src/application/create/route';

const TABLE_NAME = 'customers';
const PORT = parseInt(process.env.PORT || '3000');

describe('# Route Create Customer', () => {
  let mongod: MongoMemoryServer;

  const chance = Chance();
  let collection: Collection;

  const logger = new WinstonLoggerAdapter('CUSTOMER_TEST');
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

    server.start(PORT);
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

  it('Deve receber 422 quando uma exceção for lançada por campo inválido', async () => {
    await request(server.getApp())
      .post('/')
      .send({ ...input, cpf: '111.111.111-11' })
      .expect(422);
  });

  it('Deve receber 400 quando não informado campo obrigatório', async () => {
    const { cpf, ...inputWithoutCpf } = input;

    await request(server.getApp()).post('/').send(inputWithoutCpf).expect(400);
  });

  it('Deve receber 422 quando email já existe', async () => {
    const email = 'joe.doe@repet.com';
    await collection.insertOne({
      ...input,
      email,
    });

    await request(server.getApp())
      .post('/')
      .send({ ...input, email })
      .expect(422);
  });

  it('Deve receber 422 quando cpf já existe', async () => {
    const cpf = '041.539.840-19';
    await collection.insertOne({
      ...input,
      cpf,
    });

    await request(server.getApp())
      .post('/')
      .send({ ...input, cpf })
      .expect(422);
  });
});
