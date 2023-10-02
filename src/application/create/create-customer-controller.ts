import { Request } from 'express';

import { Controller } from '../../infra/controller/handle';
import { HttpResponse } from '../../infra/server/server';
import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

export class CreateCustomerController implements Controller {
  constructor(
    private readonly usecase: Usecase,
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
