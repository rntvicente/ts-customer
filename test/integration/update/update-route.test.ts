import { Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import Chance from 'chance';

import { WinstonLoggerAdapter } from '../../../src/config/logger/winston';
import { ExpressAdapter } from '../../../src/infra/server/express-adapter';
import { MongoHelper } from '../../../src/infra/database/mongo-helper';

import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';

import { makeUpdateController } from '../../../src/application/update/factory';
import { UpdateCustomerRoute } from '../../../src/application/update/route';

const TABLE_NAME = 'customers';
const PORT = parseInt(process.env.PORT || '3000');

describe('# Route Update Customer', () => {
  let mongod: MongoMemoryServer;

  const chance = Chance();
  let collection: Collection;
  const logger = new WinstonLoggerAdapter('CUSTOMER_TEST');
  const server = new ExpressAdapter(logger);
  const database = new MongoHelper();
  const controller = makeUpdateController(database);

  new UpdateCustomerRoute(server, controller);

  const customerId = new UniqueEntityIdVO();

  const input = {
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

  it('Deve receber 400 quando informado campo inválido', async () => {
    await request(server.getApp())
      .patch(`/${customerId.toString()}`)
      .send({ ...input, phone: parseInt(input.phone) })
      .expect(400);
  });

  it('Deve receber 400 quando não informando dados', async () => {
    await request(server.getApp())
      .patch(`/${customerId.toString()}`)
      .expect(400);
  });

  it('Deve receber 200 quando não encontrado registro', async () => {
    await collection.insertOne({
      ...input,
      cpf: chance.cpf(),
      email: chance.email(),
    });

    await request(server.getApp())
      .patch(`/${customerId.toString()}`)
      .send(input)
      .expect(200);
  });

  it('Deve atualizar name quando encontrado registro', async () => {
    await collection.insertOne({
      ...input,
      cpf: chance.cpf(),
      email: chance.email(),
      _id: customerId.value,
    });

    const updateName = chance.name();

    await request(server.getApp())
      .patch(`/${customerId.toString()}`)
      .send({ name: updateName })
      .expect(200);

    const updatedCustomer = await collection.findOne({ _id: customerId.value });

    expect(updatedCustomer.name).toStrictEqual(updateName);
  });

  it('Deve atualizar address.street quando encontrado registro', async () => {
    await collection.insertOne({
      ...input,
      cpf: chance.cpf(),
      email: chance.email(),
      _id: customerId.value,
    });

    const updateStreet = chance.street();

    await request(server.getApp())
      .patch(`/${customerId.toString()}`)
      .send({ address: { street: updateStreet } })
      .expect(200);

    const updatedCustomer = await collection.findOne({ _id: customerId.value });

    expect(updatedCustomer.address).toEqual({
      ...input.address,
      street: updateStreet,
    });
  });
});
