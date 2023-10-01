import { UnprocessableEntityError } from '../../shared/error/unprocessable-entity-error';

import { Logger } from '../../config/logger/logger';
import { CustomerType, Customer } from '../../domain/customer-entity';

import CustomerRepository from '../repository/customer-repository';

import { Usecase } from '../../config/use-case';

export class Create implements Usecase {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  async execute(input: input): Promise<string> {
    this.logger.info(`[USE CASE] saving customer: ${JSON.stringify(input)}`);

    const customer = await Customer.create(input);
    await this.repository.add(customer);

    this.logger.info(
      `[USE CASE] customer saved successfully ID ${customer.id.toString()}`
    );

    return customer.id.toString();
  }
}

export type input = Omit<CustomerType, 'id'>;
