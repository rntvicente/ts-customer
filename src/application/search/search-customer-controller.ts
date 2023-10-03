import { Request } from 'express';

import { Controller } from '../../infra/controller/handle';
import { HttpResponse } from '../../infra/server/server';
import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

export class SearchCustomerController implements Controller {
  constructor(
    private readonly usecase: Usecase,
    private readonly logger: Logger
  ) {}

  async handle({ query }: Request): Promise<HttpResponse> {
    this.logger.info(
      `[CONTROLLER] init search customer by ${JSON.stringify(query)}`
    );

    const customers = await this.usecase.execute(query.search);

    return {
      statusCode: 200,
      body: customers,
    };
  }
}
