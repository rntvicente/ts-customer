import * as dotenv from 'dotenv';

import { Server } from './infra/server/server';
import { Logger } from './config/logger/logger';

import { WinstonLoggerAdapter } from './config/logger/winston';
import { ExpressAdapter } from './infra/server/express-adapter';
import { MongoHelper } from './infra/database/mongo-helper';

import { CreateCustomerRoute } from './application/create';
import { makeCreateController } from './application/create/factory';
import { DatabaseHelper } from './infra/database/database-helper';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

export class Main {
  private readonly _logger: Logger;
  private readonly _server: Server;
  private readonly _database: DatabaseHelper;

  constructor() {
    this._logger = new WinstonLoggerAdapter('[CUSTOMER]');
    this._server = new ExpressAdapter(this._logger);
    this._database = new MongoHelper();
  }

  start() {
    this._database.connect(DATABASE_URL).then(() => {
      this._logger.info('Starting database connect');
      this._server.start(+PORT);
      this.inicializedRoutes();
    });
  }

  private inicializedRoutes() {
    this._logger.info('Initialized routes');
    new CreateCustomerRoute(this._server, makeCreateController(this._database));
  }

  stop() {
    this._database.disconnect().then(() => {
      this._logger.warn('Database stopping');
      this._server.close();
    });
  }
}

const server = new Main();

server.start();

process.on('uncaughtException', (error) => {
  console.error(`Exceção não tratada: ${error.message}`);
});

process.on('SIGINT', async () => server.stop());
