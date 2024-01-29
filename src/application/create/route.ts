import { Request } from 'express';

import { Server } from '../../infra/server/server';
import { Controller } from '../../infra/controller/handle';

import { validateCreateSchema } from '../../shared/schema/customer-schema';
import { BadRequestError } from '../../shared/error/bad-request-error';

export class CreateCustomerRoute {
  constructor(
    readonly httpServer: Pick<Server, 'on'>,
    readonly controller: Controller
  ) {
    httpServer.on('post', '/', (req: Request) => {
      const { error } = validateCreateSchema(req.body);

      if (error) throw new BadRequestError(error.message);

      return controller.handler(req);
    });
  }
}
