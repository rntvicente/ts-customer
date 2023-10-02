import { Request } from 'express';

import { Server } from '../../infra/server/server';
import { Controller } from '../../infra/controller/handle';

import { validateUpdateSchema } from '../../shared/schema/customer-schema';
import { BadRequestError } from '../../shared/error/bad-request-error';

export class UpdateCustomerRoute {
  constructor(
    readonly httpServer: Pick<Server, 'on'>,
    readonly controller: Controller
  ) {
    httpServer.on('patch', '/:customerId', (req: Request) => {
      if (Object.keys(req.body).length === 0) {
        throw new BadRequestError('body require');
      }

      const { error } = validateUpdateSchema(req.body);

      if (error) throw new BadRequestError(error.message);

      return controller.handle(req);
    });
  }
}
