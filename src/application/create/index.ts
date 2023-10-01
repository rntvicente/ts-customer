import { Request } from 'express';

import { Server } from '../../infra/server/server';
import { Controller } from '../../config/controller';

export class CreateCustomerRoute {
  constructor(
    readonly httpServer: Pick<Server, 'on'>,
    readonly controller: Controller
  ) {
    httpServer.on('post', '/', (req: Request) => {
      return controller.handle(req);
    });
  }
}
