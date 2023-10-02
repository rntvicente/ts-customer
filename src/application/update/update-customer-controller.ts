import { Request } from 'express';

import { Controller } from '../../infra/controller/handle';
import { HttpResponse } from '../../infra/server/server';
import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

export class UpdateCustomerController implements Controller {
  constructor(
    private readonly usecase: Usecase,
    private readonly logger: Logger
  ) {}

  async handle({ body, params }: Request): Promise<HttpResponse> {
    this.logger.info(`[CONTROLLER] init update customer ${params.customerId}`);

    const customerId = await this.usecase.execute({
      customerId: params.customerId,
      document: body,
    });

    return {
      statusCode: 200,
      body: { message: 'Sucesso', customerId },
    };
  }
}
