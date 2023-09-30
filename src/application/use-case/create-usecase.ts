import CustomerRepository from '../repository/customer-repository';
import { Logger } from '../../config/logger/logger';
import { CustomerType, Customer } from '../../domain/customer-entity';

import { Usecase } from './use-case.interface';
import { String } from 'aws-sdk/clients/apigateway';

export class Create implements Usecase {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  async execute(input: input): Promise<String> {
    this.logger.info(
      `[USE CASE] starting create customer: ${JSON.stringify(input)}`
    );

    const customer = await Customer.create(input);
    const id = await this.repository.add(customer);

    this.logger.info(`[USE CASE] customer add successfully ID ${id}`);

    return id;
  }
}

export type input = Omit<CustomerType, 'id'>;
