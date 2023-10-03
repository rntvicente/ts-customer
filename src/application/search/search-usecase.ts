import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

import { Customer } from '../../domain/customer-entity';
import CustomerRepository from '../repository/customer-repository';

import { CustomerMap } from '../../shared/mapper/customer-map';

export class Search implements Usecase {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  async execute(query: string): Promise<Customer[] | undefined> {
    this.logger.info(`[USE CASE] searching customer by "${query}"`);

    const customers = await this.repository.find({ $text: { $search: query } });

    this.logger.info(`found ${customers?.length} customer`);

    return customers?.map((item) => CustomerMap.toEntity(item));
  }
}
