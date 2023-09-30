import * as dotenv from 'dotenv';

import { Server } from './config/server/server';
import { Logger } from './config/logger/logger';

import { WinstonLoggerAdapter } from './config/logger/winston';
import { ExpressAdapter } from './config/server/express-adapter';
import { AWSConfig } from './config/database/dynamo-config';

import { CreateRoute } from '../src/application/create';

dotenv.config();

const PORT = process.env.PORT || 3000;

export class Main {
  private readonly _logger: Logger;
  private readonly _server: Server;

  constructor() {
    this._logger = new WinstonLoggerAdapter('[CUSTOMER]');
    this._server = new ExpressAdapter(this._logger);

    new AWSConfig(
      process.env.AWS_REGION,
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY
    );
  }

  start() {
    this._server.start(+PORT);
    this.inicializedRoutes();
  }

  private inicializedRoutes() {
    this._logger.info('Initialized routes');

    new CreateRoute(this._server);
  }

  async stop() {
    this._server.close();
  }
}

const server = new Main();

server.start();
process.on('SIGINT', async () => server.stop());
