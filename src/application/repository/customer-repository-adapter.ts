import { CustomerMap } from '../../shared/mapper/customer-map';
import { DatabaseHelper } from '../../config/database/database-helper';

import { Customer } from '../../domain/customer-entity';
import CustomerRepository from './customer-repository';

const TABLE_NAME = 'customers';

export class CustomerRepositoryAdapter implements CustomerRepository {
  constructor(private readonly database: DatabaseHelper) {}

  async add(customer: Customer): Promise<void> {
    const model = CustomerMap.toModel(customer);
    const collection = await this.database.getCollection(TABLE_NAME);
    await collection.insertOne(model);
  }
}
