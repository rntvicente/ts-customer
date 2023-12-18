import * as dotenv from 'dotenv';

import { Server } from './infra/server/server';
import { Queue } from './infra/queue';
import { Logger } from './config/logger/logger';

import { WinstonLoggerAdapter } from './config/logger/winston';
import { ExpressAdapter } from './infra/server/express-adapter';
import { MongoHelper } from './infra/database/mongo-helper';

import { CreateCustomerRoute } from './application/create/route';
import { UpdateCustomerRoute } from './application/update/route';
import { DeleteCustomerRoute } from './application/delete/route';
import { SearchCustomerRoute } from './application/search/route';

import { makeCreateController } from './application/create/factory';
import { makeUpdateController } from './application/update/factory';
import { makeDeleteController } from './application/delete/factory';
import { makeSearchController } from './application/search/factory';

import { DatabaseHelper } from './infra/database/database-helper';
import { AwsAdapter } from './infra/queue/aws-adapter';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || '';
const AWS_REGION = process.env.AWS_REGION || '';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';

export class Main {
  private readonly _logger: Logger;
  private readonly _server: Server;
  private readonly _database: DatabaseHelper;
  private readonly _queue: Queue;

  constructor() {
    this._logger = new WinstonLoggerAdapter('[CUSTOMER]');
    this._server = new ExpressAdapter(this._logger);
    this._database = new MongoHelper();
    this._queue = new AwsAdapter(this._logger);
  }

  start() {
    this._database.connect(DATABASE_URL).then(() => {
      this._logger.info('Starting database connect');
      this._queue.init({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: AWS_REGION,
      });
      this._server.start(+PORT);
      this.inicializedRoutes();
    });
  }

  private inicializedRoutes() {
    this._logger.info('Initialized routes');
    new UpdateCustomerRoute(this._server, makeUpdateController(this._database));
    new DeleteCustomerRoute(this._server, makeDeleteController(this._database));
    new SearchCustomerRoute(this._server, makeSearchController(this._database));
    new CreateCustomerRoute(
      this._server,
      makeCreateController(this._database, this._queue)
    );
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
  console.error(`Unhandled exception: ${error.message}`);
});

process.on('SIGINT', async () => server.stop());
