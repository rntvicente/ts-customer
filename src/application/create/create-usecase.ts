import { Logger } from '../../config/logger/logger';
import { Usecase } from '../../config/use-case';

import { CustomerMap } from '../../shared/mapper/customer-map';
import { UnprocessableEntityError } from '../../shared/error/unprocessable-entity-error';

import { CustomerType, Customer } from '../../domain/customer-entity';
import CustomerRepository from '../repository/customer-repository';

export class Create implements Usecase {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  async execute(input: input): Promise<string> {
    this.logger.info(`[USE CASE] saving customer: ${JSON.stringify(input)}`);

    await this.customerExists(input.email, input.cpf);

    const customer = await Customer.create(input);
    await this.repository.add(customer);

    this.logger.info(
      `[USE CASE] customer saved successfully ID ${customer.id.toString()}`
    );

    return customer.id.toString();
  }

  private async customerExists(
    email: string,
    cpf: string
  ): Promise<Customer | undefined> {
    this.logger.info(
      `[USE CASE] find customer by email ${email} or cpf ${cpf}`
    );

    const filter = {
      $or: [{ cpf }, { email }],
    };

    const customerModel = await this.repository.findOne(filter);

    if (customerModel) {
      this.logger.info(
        `[USE CASE] found customer ${JSON.stringify(customerModel)}`
      );

      throw new UnprocessableEntityError('found customer');
    }

    return;
  }
}

export type input = Omit<CustomerType, 'id'>;
