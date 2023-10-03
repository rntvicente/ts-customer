import { UniqueEntityIdVO } from '../../shared/value-object/unique-entity-id.vo';
import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

import CustomerRepository from '../repository/customer-repository';

export class Delete implements Usecase {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  async execute(customerId: string): Promise<Output> {
    this.logger.info(
      `[USE CASE] deleting customer ${JSON.stringify(customerId)}`
    );

    const uniqueEntity = new UniqueEntityIdVO(customerId);
    const deletedCount = await this.repository.remove(uniqueEntity.value);

    if (deletedCount <= 0) {
      this.logger.info(`[USE CASE] not found customer ${customerId}`);
      return { message: 'Cliente não encontrado' };
    }

    this.logger.info(
      `[USE CASE] customer deleted successfully ID ${customerId}`
    );

    return { message: 'Sucesso' };
  }
}

export type Output = {
  message: string;
};
