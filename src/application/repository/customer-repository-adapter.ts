import { Account } from 'aws-sdk';
import { DatabaseHelper } from '../../config/database/database-helper';

import { Customer } from '../../domain/customer-entity';
import CustomerRepository from './customer-repository';

const TABLE_NAME = 'customers';

export class CustomerRepositoryAdapter implements CustomerRepository {
  constructor(private readonly database: DatabaseHelper) {}

  async add(customer: Customer): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: Account,
    };

    await this.database.add(params);
  }
}
