import { Request } from 'express';

import { Controller } from '../../infra/controller/handle';
import { HttpResponse } from '../../infra/server/server';
import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

export class DeleteCustomerController implements Controller {
  constructor(
    private readonly usecase: Usecase,
    private readonly logger: Logger
  ) {}

  async handle({ params: { customerId } }: Request): Promise<HttpResponse> {
    this.logger.info(`[CONTROLLER] init delete customer ${customerId}`);

    const { message } = await this.usecase.execute(customerId);

    return {
      statusCode: 200,
      body: { message, customerId },
    };
  }
}
