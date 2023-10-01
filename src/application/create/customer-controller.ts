import { Request } from 'express';

import { Controller } from '../../config/controller';
import { HttpResponse } from '../../infra/server/server';
import { Logger } from '../../config/logger/logger';

import { Create } from './create-usecase';

export class CustomerController implements Controller {
  constructor(
    private readonly usecase: Create,
    private readonly logger: Logger
  ) {}

  async handle({ body }: Request): Promise<HttpResponse> {
    this.logger.info(`[CONTROLLER] init create customer`);
    const customerId = await this.usecase.execute(body);

    return {
      statusCode: 201,
      body: { message: 'Sucesso', customerId },
    };
  }
}
