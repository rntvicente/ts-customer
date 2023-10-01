import { UniqueEntityIdVO } from 'shared/value-object/unique-entity-id.vo';
import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

import { CustomerType, Customer } from '../../domain/customer-entity';
import CustomerRepository from '../repository/customer-repository';

export class Update implements Usecase {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  async execute({ customerId, document }: input): Promise<void> {
    this.logger.info(
      `[USE CASE] saving customer ${JSON.stringify(
        customerId
      )} document ${document}`
    );

    const uniqueEntity = new UniqueEntityIdVO(customerId);

    await this.repository.findOneAndUpdate(
      { _id: uniqueEntity.value },
      document
    );

    this.logger.info(`[USE CASE] customer saved successfully ID ${customerId}`);
  }
}

export type input = {
  customerId: string;
  document: Omit<CustomerType, 'id' | 'email' | 'cpf'>;
};
