import { Request } from 'express';

import { Server } from '../../infra/server/server';
import { Controller } from '../../infra/controller/handle';

export class SearchCustomerRoute {
  constructor(
    readonly httpServer: Pick<Server, 'on'>,
    readonly controller: Controller
  ) {
    httpServer.on('get', '/', (req: Request) => {
      return controller.handle(req);
    });
  }
}
