import { UniqueEntityIdVO } from '../../shared/value-object/unique-entity-id.vo';
import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

import { CustomerType, Customer } from '../../domain/customer-entity';
import CustomerRepository from '../repository/customer-repository';

export class Delete implements Usecase {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  async execute({ customerId, document }: input): Promise<void> {
    this.logger.info(
      `[USE CASE] deleting customer ${JSON.stringify(
        customerId
      )} document ${JSON.stringify(document)}`
    );

    const uniqueEntity = new UniqueEntityIdVO(customerId);
    const deletedCount = await this.repository.remove(uniqueEntity.value);

    if (deletedCount > 0) {
      this.logger.info(
        `[USE CASE] customer deleted successfully ID ${customerId}`
      );
    }

    if (deletedCount <= 0) {
      this.logger.info(`[USE CASE] not found customer ${customerId}`);
    }
  }
}

export type input = {
  customerId: string;
  document: Omit<CustomerType, 'id' | 'email' | 'cpf'>;
};
