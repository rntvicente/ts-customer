import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

import CustomerRepository from '../repository/customer-repository';

import { CustomerModel } from 'application/repository/model/customer-model';

export class Search implements Usecase {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  async execute(query: string): Promise<CustomerModel[] | null> {
    this.logger.info(
      `[USE CASE] searching customer by ${JSON.stringify(query)}`
    );

    const customers = await this.repository.find({
      $text: { $search: query },
    });

    this.logger.info(`found ${customers?.length || 0} customer`);

    return customers;
  }
}
