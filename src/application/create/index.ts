import { Request } from 'express';

import { Server } from '../../config/server/server';
import { Controller } from '../controller';

export class CreateRoute {
  constructor(
    readonly httpServer: Pick<Server, 'on'>,
    readonly controller: Controller
  ) {
    httpServer.on('post', '/', (req: Request) => {
      return controller.handle(req);
    });
  }
}
